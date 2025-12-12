import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
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
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
