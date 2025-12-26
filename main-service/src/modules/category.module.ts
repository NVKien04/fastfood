import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controllers/auth.controller';
import { CategoryController } from 'src/controllers/category.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { UserEntity } from 'src/entities/user.entity';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { CategoryRepository } from 'src/repositories/category/category.repository';
import { UserRepository } from 'src/repositories/user/user.repository';
import { AuthService } from 'src/services/auth.service';
import { CategoryService } from 'src/services/category.service';
import { UserService } from 'src/services/user.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

import { LocalStrategy } from 'src/strategies/local.strategy';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    UserService,
    LocalStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    AuthorizationGuard,
    JwtStrategy,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],

  exports: [CategoryService],
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
})
export class CategoryModule {}
