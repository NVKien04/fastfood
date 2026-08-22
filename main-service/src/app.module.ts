import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor, LoggingInterceptor } from '@/common/interceptors';
import { StartTimingMiddleware } from '@/common/middleware/start-timing.middleware';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryModule } from '@/modules/category/category.module';
import { ProductModule } from '@/modules/product/product.module';
import { IngredientModule } from '@/modules/ingredient/ingredient.module';
import { AddressModule } from '@/modules/address/address.module';
import { CouponModule } from '@/modules/coupon/coupon.module';
import { OrderModule } from '@/modules/order/order.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';
import { ProductIngredientModule } from '@/modules/product-ingredient/product-ingredient.module';
import { UserCouponModule } from '@/modules/user-coupon/user-coupon.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { ComboModule } from '@/modules/combo/combo.module';
import { CacheModule } from '@/modules/cache/cache.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { DeliverySimulationModule } from '@/modules/delivery-simulation/delivery-simulation.module';

// Domain Modules

@Module({
  imports: [
    HttpModule,
    CacheModule,
    StorageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';
        const dbUrl = configService.get<string>('DATABASE_URL');
        const isSsl =
          configService.get<string>('DB_SSL') === 'true' || isProd || (!!dbUrl && dbUrl.includes('sslmode=require'));

        if (dbUrl && dbUrl !== 'DATABASE_URL') {
          return {
            type: 'postgres',
            url: dbUrl,
            synchronize: false,
            autoLoadEntities: true,
            logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
            ssl: isSsl ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD') ?? '',
          database: configService.get<string>('DB_NAME', 'fastfood'),
          synchronize: false,
          autoLoadEntities: true,
          logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
          ssl: isSsl ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN', '15m'),
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
    OrderModule,
    ProductVariantModule,
    ProductIngredientModule,
    UserCouponModule,
    NotificationModule,
    ComboModule,
    DeliverySimulationModule,
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
