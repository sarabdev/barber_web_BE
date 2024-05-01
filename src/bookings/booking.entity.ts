import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column()
  serviceName: string;
}
