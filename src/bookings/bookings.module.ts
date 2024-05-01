import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
