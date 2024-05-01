import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/auth/user.entity';
import { Booking } from 'src/bookings/booking.entity';

dotenv.config();
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectTimeout: 60000,
  entities: [User, Booking],
  logging: false,
  synchronize: true,
};
