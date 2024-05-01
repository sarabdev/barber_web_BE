import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../auth/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailToAdmin(user: User, service: any) {
    await this.mailerService
      .sendMail({
        to: 'yadistyled@gmail.com',
        subject: 'User checkout',
        template: './invite',
        context: {
          name: user?.firstName + user?.lastName,
          email: user?.email,
          title: service?.title,
          description: service?.description,
          price: service?.price,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendEmailToUser(user: User, service: any) {
    await this.mailerService
      .sendMail({
        to: user?.email,
        subject: 'Yadistyle checkout',
        template: './checkout',
        context: {
          name: user?.firstName + user?.lastName,
          email: user?.email,
          title: service?.title,
          description: service?.description,
          price: service?.price,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendContactMail(user: User, data: any) {
    await this.mailerService
      .sendMail({
        to: 'yadistyled@gmail.com',
        from: user?.email,
        subject: data?.subject,
        template: './contact',
        context: {
          name: user?.firstName + user?.lastName,
          email: user?.email,
          message: data?.message,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
