import { UseGuards, applyDecorators } from '@nestjs/common';
import { RoleEnum } from 'src/enums/role.enum';
import { AuthorizationGuard, Roles } from 'src/guards/authorization.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

export const Auth = (...roles: RoleEnum[]) =>
  applyDecorators(UseGuards(JwtAuthGuard, AuthorizationGuard), Roles(...roles));
