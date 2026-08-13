import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { StartTimingMiddleware } from '@/common/middleware/start-timing.middleware';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

// Domain Modules
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryModule } from '@/modules/category/category.module';
import { ProductModule } from '@/modules/product/product.module';
import { IngredientModule } from '@/modules/ingredient/ingredient.module';
import { AddressModule } from '@/modules/address/address.module';
import { CouponModule } from '@/modules/coupon/coupon.module';
import { ReviewModule } from '@/modules/review/review.module';
import { CartModule } from '@/modules/cart/cart.module';
import { OrderModule } from '@/modules/order/order.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';
import { ProductIngredientModule } from '@/modules/product-ingredient/product-ingredient.module';
import { UserCouponModule } from '@/modules/user-coupon/user-coupon.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { ComboModule } from '@/modules/combo/combo.module';
import { RedisModule } from '@/modules/redis/redis.module';

@Module({
  imports: [
    HttpModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
    ProductVariantModule,
    ProductIngredientModule,
    UserCouponModule,
    NotificationModule,
    ComboModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
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
