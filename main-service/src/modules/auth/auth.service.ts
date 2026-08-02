import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '#src/modules/user/repository/user.repository.interface';
import { HashUtil } from '#src/utils/hash.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const alreadyUser = await this.repo.findByEmail(email);

    if (!alreadyUser) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isCorrectPassword = await HashUtil.compare(password, alreadyUser.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return { id: alreadyUser.id, role: alreadyUser.role };
  }

  async login(id: string, role: string) {
    const accessToken = await this.jwtService.signAsync({
      uid: id,
      role: role,
    });
    return { accessToken: accessToken };
  }
}
