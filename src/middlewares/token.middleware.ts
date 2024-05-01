import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private JwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        throw new UnauthorizedException('User not present');
      }

      const tokenParts = token.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
        throw new UnauthorizedException('User not present');
      }

      const jwtToken = tokenParts[1];

      const data = await this.JwtService.verifyAsync(jwtToken);
      const email = data?.email;

      const user = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid User');
      }

      req['user_id'] = user.id;
      req['user_email'] = user.email;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid User');
    }
  }
}
