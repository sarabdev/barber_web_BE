import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middlewares/token.middleware';
import { User } from './auth/user.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/booking.entity';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { StripeController } from './stripe/stripe.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Booking]),
    AuthModule,
    BookingsModule,
    MailModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BookingsController,
    StripeController,
  ],
  providers: [AppService, AuthService, BookingsService, MailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'auth/signup',
        'auth/signin',
        'auth/update/profile-pic',
        'auth/create-admin',
      )
      .forRoutes('*');
  }
}
