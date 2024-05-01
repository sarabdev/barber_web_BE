import { JwtService } from '@nestjs/jwt';
import { Multer } from 'multer';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './createUserDto';
import { hashPassword, passwordMatch } from './bcrypt.util';
import * as fs from 'fs';
import * as path from 'path';
import { UserSigninDto } from './userSigninDto';
import { MailService } from 'src/mail/mail.service';
import { UpdateUserDto } from './updateUserDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return {
      message: 'User registered successfully',
      user: { email: createUserDto.email },
    };
  }

  async signIn(
    userData: UserSigninDto,
  ): Promise<{ access_token: string; message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or email is incorrect');
    }
    const confrimPassword = await passwordMatch(
      userData.password,
      user.password,
    );
    if (!confrimPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { id: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      message: 'Signin successfully',
    };
  }

  async getUser(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['bookings'],
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching user with profile pic');
    }
  }

  async addCustomerId(id: number, customerId) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.customerId = customerId;
    await this.userRepository.save(user);
  }
}
