export interface IMailAttachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface ISendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: IMailAttachment[];
}

export enum OtpPurpose {
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  TWO_FACTOR = 'TWO_FACTOR',
}

export interface ISendOtpEmailOptions {
  to: string;
  otp: string;
  purpose?: OtpPurpose;
  userName?: string;
  expiresInMinutes?: number;
}

export interface ISendWelcomeEmailOptions {
  to: string;
  userName: string;
  loginUrl?: string;
}

export interface IOrderItemEmail {
  name: string;
  quantity: number;
  price: number;
  variantName?: string;
  note?: string;
}

export interface ISendOrderConfirmationOptions {
  to: string;
  customerName: string;
  orderCode: string;
  items: IOrderItemEmail[];
  totalAmount: number;
  shippingFee?: number;
  discountAmount?: number;
  finalAmount: number;
  deliveryAddress: string;
  paymentMethod?: string;
  orderDate?: Date | string;
  trackingUrl?: string;
}

export interface ISendOrderStatusEmailOptions {
  to: string;
  customerName: string;
  orderCode: string;
  status: string;
  statusDescription: string;
  finalAmount?: number;
  deliveryAddress?: string;
  trackingUrl?: string;
}

export interface ISendCouponEmailOptions {
  to: string | string[];
  userName?: string;
  couponCode: string;
  discountDisplay: string;
  minOrderValue?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
  usageUrl?: string;
}

export interface IMailProvider {
  sendMail(options: ISendMailOptions): Promise<boolean>;
}

export interface IMailService {
  sendMail(options: ISendMailOptions): Promise<boolean>;
  sendOtpEmail(options: ISendOtpEmailOptions): Promise<boolean>;
  sendWelcomeEmail(options: ISendWelcomeEmailOptions): Promise<boolean>;
  sendOrderConfirmationEmail(options: ISendOrderConfirmationOptions): Promise<boolean>;
  sendOrderStatusEmail(options: ISendOrderStatusEmailOptions): Promise<boolean>;
  sendCouponNotificationEmail(options: ISendCouponEmailOptions): Promise<boolean>;
}
