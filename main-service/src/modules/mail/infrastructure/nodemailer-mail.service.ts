import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IMailProvider, ISendMailOptions } from '@/modules/mail/domain/interfaces/mail.interface';

@Injectable()
export class NodemailerMailService implements IMailProvider, OnModuleInit {
  private readonly logger = new Logger(NodemailerMailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private defaultFrom: string = 'FastFood Delivery <no-reply@fastfood.com>';

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initTransporter();
  }

  /**
   * Khởi tạo transporter nodemailer từ biến môi trường SMTP
   */
  private initTransporter() {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = Number(this.configService.get<string>('MAIL_PORT') || 587);
    const secure = this.configService.get<string>('MAIL_SECURE') === 'true' || port === 465;
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');
    const fromName = this.configService.get<string>('MAIL_FROM_NAME') || 'FastFood Delivery';
    const fromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS') || 'no-reply@fastfood.com';

    this.defaultFrom = `"${fromName}" <${fromAddress}>`;

    if (!host || !user || !pass) {
      this.logger.warn(
        '⚠️ Mail service chưa được cấu hình đầy đủ (MAIL_HOST, MAIL_USER, MAIL_PASSWORD). Các email gửi đi sẽ được mô phỏng log ở console.',
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      });

      this.transporter.verify((error) => {
        if (error) {
          this.logger.error(`❌ Kết nối SMTP thất bại: ${error.message}`);
        } else {
          this.logger.log(`✅ Mail service kết nối SMTP thành công qua ${host}:${port}`);
        }
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`❌ Khởi tạo Mail Transporter thất bại: ${message}`);
    }
  }

  /**
   * Gửi email raw thông qua Nodemailer Transporter
   */
  async sendMail(options: ISendMailOptions): Promise<boolean> {
    const { to, subject, text, html, cc, bcc, replyTo, attachments } = options;
    const recipientStr = Array.isArray(to) ? to.join(', ') : to;

    if (!this.transporter) {
      this.logger.warn(`[MOCK EMAIL SEND] Đến: ${recipientStr} | Tiêu đề: "${subject}"`);
      if (text) this.logger.debug(`[MOCK EMAIL TEXT]: ${text}`);
      return true;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.defaultFrom,
        to,
        subject,
        text,
        html,
        cc,
        bcc,
        replyTo,
        attachments: attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          path: att.path,
          contentType: att.contentType,
        })),
      });

      this.logger.log(`📧 Gửi email thành công tới ${recipientStr} (MessageId: ${info.messageId})`);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`❌ Gửi email tới ${recipientStr} thất bại: ${message}`);
      return false;
    }
  }
}
