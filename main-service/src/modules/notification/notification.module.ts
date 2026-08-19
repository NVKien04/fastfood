import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '@/entities';
import { NotificationService } from '@/modules/notification/application/services/notification.service';
import { NotificationTypeOrmRepository } from '@/modules/notification/infrastructure/persistence/typeorm/notification.typeorm.repository';
import { NotificationController } from '@/modules/notification/presentation/controllers/notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'INotificationRepository',
      useClass: NotificationTypeOrmRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
