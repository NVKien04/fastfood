import { RoleEnum } from 'src/enums/role.enum';
import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RoleEnum[]>('roles', [context.getHandler(), context.getClass()]);
    // Api không có đánh dấu metadata role
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRole = user?.role || user?.dataValues?.role;

    if (!user || !roles.includes(userRole)) {
      throw new UnauthorizedException('Bạn không có quyền truy cập.');
    }

    return true;
  }
}

export const AdminOnly = () => Roles(RoleEnum.ADMIN);
export const CustomerOnly = () => Roles(RoleEnum.CUSTOMER);
export const CustomerOrAdmin = () => Roles(RoleEnum.ADMIN, RoleEnum.CUSTOMER);
