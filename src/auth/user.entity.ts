import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  customerId: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
