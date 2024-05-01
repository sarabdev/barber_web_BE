// src/bookings/bookings.controller.ts
import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './bookingdtos';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() serviceId, @Request() req): Promise<Booking> {
    const userId = req['user_id'];
    return this.bookingsService.create(userId, serviceId);
  }

  @Get()
  async findAll(@Request() req): Promise<Booking[]> {
    const userId = req['user_id'];
    return this.bookingsService.find(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(+id);
  }
}
