import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/interceptors/response.interceptor';
import { StartTimingMiddleware } from './common/middleware/start-timing.middleware';
import { AuthModule } from './modules/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { CategoryModule } from './modules/category.module';
import { ProductModule } from './modules/product.module';
import { IngredientModule } from './modules/ingredient.module';
import { AddressModule } from './modules/address.module';
import { CouponModule } from './modules/coupon.module';
import { ReviewModule } from './modules/review.module';
import { CartModule } from './modules/cart.module';
import { OrderModule } from './modules/order.module';
import { ProductIngredientModule } from './modules/productIngredient.module';
import { UserCouponModule } from './modules/userCoupon.module';
import { ProductVariantModule } from './modules/productVariant.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD') ?? '',
        database: configService.get<string>('DB_NAME', 'fastfood'),
        // synchronize: configService.get<string>('DB_SYNC', 'false') === 'true',
        synchronize: false,
        autoLoadEntities: true,
        logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
        ssl: false,
        // configService.get<string>('NODE_ENV') === 'production'
        //   ?
        //   { rejectUnauthorized: false }
        //   : false,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN', '60s'),
        },
        global: true,
      }),
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    IngredientModule,
    AddressModule,
    CouponModule,
    ReviewModule,
    CartModule,
    OrderModule,
    ProductIngredientModule,
    UserCouponModule,
    ProductVariantModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StartTimingMiddleware).forRoutes({
      path: '*path',
      method: RequestMethod.ALL,
    });
  }
}
