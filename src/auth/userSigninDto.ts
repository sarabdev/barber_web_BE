// src/auth/create-user.dto.ts

import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserSigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
