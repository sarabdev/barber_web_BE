import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './createUserDto';
import { UserSigninDto } from './userSigninDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() UserSigninDto: UserSigninDto) {
    return this.authService.signIn(UserSigninDto);
  }

  @Get('me')
  async getMe(@Request() req) {
    const userId = req['user_id'];
    return this.authService.getUser(userId);
  }
}
