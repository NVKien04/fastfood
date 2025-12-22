import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/interceptors/response.interceptor';
import { StartTimingMiddleware } from './common/middleware/start-timing.middleware';
import { AuthModule } from './modules/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Module({
  imports: [
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
