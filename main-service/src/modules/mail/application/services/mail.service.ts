import { Injectable, Inject } from '@nestjs/common';
import {
  type IMailService,
  type IMailProvider,
  type ISendMailOptions,
  type ISendOtpEmailOptions,
  type ISendWelcomeEmailOptions,
  type ISendOrderConfirmationOptions,
  type ISendOrderStatusEmailOptions,
  type ISendCouponEmailOptions,
  OtpPurpose,
} from '@/modules/mail/domain/interfaces/mail.interface';
import {
  renderOtpEmailTemplate,
  renderWelcomeEmailTemplate,
  renderOrderConfirmationEmailTemplate,
  renderOrderStatusEmailTemplate,
  renderCouponNotificationEmailTemplate,
} from '@/modules/mail/utils/mail-template.util';

@Injectable()
export class MailService implements IMailService {
  constructor(
    @Inject('IMailProvider')
    private readonly mailProvider: IMailProvider,
  ) {}

  /**
   * Gửi email chung
   */
  async sendMail(options: ISendMailOptions): Promise<boolean> {
    return this.mailProvider.sendMail(options);
  }

  /**
   * Gửi email mã xác thực OTP (Đăng ký, Quên mật khẩu, Xác thực 2 bước)
   */
  async sendOtpEmail(options: ISendOtpEmailOptions): Promise<boolean> {
    const html = renderOtpEmailTemplate(options);
    const subject =
      options.purpose === OtpPurpose.FORGOT_PASSWORD ? 'Mã xác nhận khôi phục mật khẩu' : 'Mã xác thực tài khoản';

    return this.mailProvider.sendMail({
      to: options.to,
      subject,
      html,
      text: `Mã xác thực của bạn là: ${options.otp}. Mã này có hiệu lực trong ${options.expiresInMinutes || 5} phút.`,
    });
  }

  /**
   * Gửi email chào mừng thành viên mới
   */
  async sendWelcomeEmail(options: ISendWelcomeEmailOptions): Promise<boolean> {
    const html = renderWelcomeEmailTemplate(options);

    return this.mailProvider.sendMail({
      to: options.to,
      subject: `Chào mừng ${options.userName} đến với FastFood Delivery! 🎉`,
      html,
      text: `Chào mừng ${options.userName} đến với FastFood Delivery! Chúc bạn có trải nghiệm đặt món tuyệt vời.`,
    });
  }

  /**
   * Gửi email xác nhận đơn hàng
   */
  async sendOrderConfirmationEmail(options: ISendOrderConfirmationOptions): Promise<boolean> {
    const html = renderOrderConfirmationEmailTemplate(options);

    return this.mailProvider.sendMail({
      to: options.to,
      subject: `Xác nhận đơn hàng #${options.orderCode} - FastFood Delivery`,
      html,
      text: `Đơn hàng #${options.orderCode} của bạn đã được tiếp nhận. Tổng thanh toán: ${options.finalAmount} VND.`,
    });
  }

  /**
   * Gửi email cập nhật trạng thái đơn hàng
   */
  async sendOrderStatusEmail(options: ISendOrderStatusEmailOptions): Promise<boolean> {
    const html = renderOrderStatusEmailTemplate(options);

    return this.mailProvider.sendMail({
      to: options.to,
      subject: `Cập nhật đơn hàng #${options.orderCode}: ${options.status} - FastFood Delivery`,
      html,
      text: `Đơn hàng #${options.orderCode} của bạn: ${options.status} (${options.statusDescription}).`,
    });
  }

  /**
   * Gửi email thông báo mã giảm giá / Voucher ưu đãi
   */
  async sendCouponNotificationEmail(options: ISendCouponEmailOptions): Promise<boolean> {
    const html = renderCouponNotificationEmailTemplate(options);

    return this.mailProvider.sendMail({
      to: options.to,
      subject: `🎁 Quà tặng ưu đãi: Voucher ${options.couponCode} giảm ${options.discountDisplay}`,
      html,
      text: `Bạn nhận được mã giảm giá ${options.couponCode} (${options.discountDisplay}) tại FastFood Delivery!`,
    });
  }
}
