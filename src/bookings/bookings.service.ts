// src/bookings/bookings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './bookingdtos';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, product: any): Promise<Booking> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const newBooking = this.bookingRepository.create({
        serviceName: product?.title,
        user: user,
        date: product?.productdate,
        comment: product?.productComment,
      });

      return await this.bookingRepository.save(newBooking);
    } catch (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  async find(userId: number): Promise<Booking[]> {
    try {
      return await this.bookingRepository.find();
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { user: { id } },
      });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      throw new Error(`Failed to find booking: ${error.message}`);
    }
  }
}
