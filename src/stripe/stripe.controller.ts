import {
  Controller,
  Post,
  Res,
  Body,
  Req,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { BookingsService } from 'src/bookings/bookings.service';

import Stripe from 'stripe';
import { MailService } from 'src/mail/mail.service';

const stripe = new Stripe(
  'sk_test_51OzOrdL6WPRQ14z7c6eiX9R8s8ai2fCl3lR3bsnRTo7DZLZyvnfrWQwaZj4GgftTwqO2bQNsCaepPBdIlASlemsI00cIx9fVhO',
);

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly authService: AuthService,
    private readonly bookingService: BookingsService,
    private mailerService: MailService,
  ) {}
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() product: any,
  ) {
    try {
      const userId = req['user_id'];
      const user = await this.authService.getUser(userId);
      let customer;
      if (user.customerId) {
        customer = await stripe.customers.retrieve(user.customerId);
      } else {
        customer = await stripe.customers.create({
          email: user?.email,
          name: user?.firstName,
        });
        await this.authService.addCustomerId(user?.id, customer?.id);
      }

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product?.title,
                description: product?.description,
              },
              unit_amount: product.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          product_title: product?.title,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/services?payment_success=true&product_title=${product?.title}&date=${product?.date}&comment=${product?.comment}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/services?payment_success=false`,
      });
      return { url: session.url };
    } catch (error) {
      console.log(error);
    }
  }

  @Post('send-mail')
  async sendEmailToAdmin(@Req() req, @Body() product: any) {
    try {
      const userId = req['user_id'];
      const user = await this.authService.getUser(userId);
      await this.bookingService.create(userId, product);
      await this.mailerService.sendEmailToAdmin(user, product);
      await this.mailerService.sendEmailToUser(user, product);
    } catch (error) {
      console.log(error);
    }
  }
  @Post('send-contact-mail')
  async sendContactEmail(@Req() req, @Body() data: any) {
    try {
      const userId = req['user_id'];
      const user = await this.authService.getUser(userId);
      await this.mailerService.sendContactMail(user, data);
    } catch (error) {
      console.log(error);
    }
  }

  // @Get('payments')
  // async getAllPaymentsByCustomer(@Req() req) {
  //   try {
  //     const userId = req['user_id'];
  //     const user = await this.authService.getUser(userId);
  //     if (!user.customerId) {
  //       return [];
  //     }

  //     const customerId = user.customerId;
  //     const charges = await stripe.charges.list({ customer: customerId });
  //     const nonRefundedPayments = charges.data.filter(
  //       (charge) => !charge.refunded,
  //     );
  //     return nonRefundedPayments;
  //   } catch (error) {
  //     console.error('Error fetching payments:', error);
  //     throw error;
  //   }
  // }
}
