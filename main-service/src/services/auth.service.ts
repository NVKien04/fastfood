import {
  BadGatewayException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { promises } from 'dns';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { UserEntity } from 'src/entities/user.entity';
import type { IUserRepository } from 'src/repositories/user/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/strategies/local.strategy';

export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly repo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const alreadyUser = await this.repo.findByEmail(email);

      if (!alreadyUser) {
        throw new BadRequestException('Tài khoản chưa được đăng kí');
      }
      const isCorrectPassword = bcrypt.compareSync(
        password,
        alreadyUser?.password,
      );
      if (!isCorrectPassword) {
        throw new BadRequestException('Thông tin đăng nhập sai!');
      }
      return { id: alreadyUser.id, role: alreadyUser.role };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Mã định danh đã tồn tại!');
      }
      throw error;
    }
  }

  async login(id: string, role: string) {
    const accessToken = await this.jwtService.signAsync({
      uid: id,
      role: role,
    });
    return accessToken;
  }
}
