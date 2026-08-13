import { Controller, Get, Patch, Delete, Param, Request } from '@nestjs/common';
import { NotificationService } from '@/modules/notification/application/services/notification.service';
import { Auth } from '@/common/decorators/auth.decorator';
import { RoleEnum } from '@/enums/role.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
    role: string;
  };
}

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Lấy danh sách thông báo của người dùng đăng nhập
   */
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @Get()
  async getNotifications(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const notifications = await this.notificationService.getUserNotifications(userId);
    return {
      data: notifications,
    };
  }

  /**
   * Đánh dấu đã đọc tất cả thông báo của người dùng đăng nhập
   */
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @Patch('read-all')
  async markAllAsRead(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    await this.notificationService.markAllAsRead(userId);
    return {
      message: 'Đã đánh dấu đọc tất cả thông báo thành công',
    };
  }

  /**
   * Đánh dấu đã đọc cho 1 thông báo cụ thể
   */
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @Patch(':id/read')
  async markAsRead(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.userId;
    const notification = await this.notificationService.markAsRead(id, userId);
    return {
      data: notification,
      message: 'Đã đánh dấu đọc thông báo thành công',
    };
  }

  /**
   * Xóa thông báo
   */
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @Delete(':id')
  async deleteNotification(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.notificationService.deleteNotification(id, userId);
    return {
      message: 'Xóa thông báo thành công',
    };
  }
}
