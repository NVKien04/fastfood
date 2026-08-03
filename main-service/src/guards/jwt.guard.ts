import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        message: 'Token đã hết hạn',
        errorCode: 'JWT_EXPIRED',
        expiredAt: info.expiredAt,
      });
    }
    if (info) {
      throw new UnauthorizedException({
        message: 'Token không hợp lệ',
        errorCode: 'JWT_INVALID',
      });
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
