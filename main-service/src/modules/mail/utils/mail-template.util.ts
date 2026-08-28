import {
  ISendOtpEmailOptions,
  ISendWelcomeEmailOptions,
  ISendOrderConfirmationOptions,
  OtpPurpose,
} from '@/modules/mail/domain/interfaces/mail.interface';

const BRAND_NAME = 'FastFood Delivery';
const PRIMARY_COLOR = '#FF4757';
const SECONDARY_COLOR = '#2F3542';
const BG_COLOR = '#F1F2F6';

/**
 * Khung HTML cơ bản đồng bộ phong cách thương hiệu FastFood
 */
export function renderBaseTemplate(title: string, bodyContent: string): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: ${BG_COLOR};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: ${BG_COLOR};
      padding: 30px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #FF6B81 100%);
      padding: 28px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 28px;
    }
    .footer {
      background-color: #FAFAFB;
      border-top: 1px solid #ECEEF1;
      padding: 20px 24px;
      text-align: center;
      font-size: 13px;
      color: #888888;
    }
    .footer a {
      color: ${PRIMARY_COLOR};
      text-decoration: none;
    }
    .btn {
      display: inline-block;
      background-color: ${PRIMARY_COLOR};
      color: #ffffff !important;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      margin-top: 16px;
      text-align: center;
    }
    .highlight-box {
      background-color: #FFF5F5;
      border: 1px dashed ${PRIMARY_COLOR};
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>🍔 ${BRAND_NAME}</h1>
      </div>
      <div class="content">
        ${bodyContent}
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px 0;">Cảm ơn bạn đã tin tưởng và đồng hành cùng <strong>${BRAND_NAME}</strong>.</p>
        <p style="margin: 0;">© ${currentYear} ${BRAND_NAME}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Tạo nội dung email OTP
 */
export function renderOtpEmailTemplate(options: ISendOtpEmailOptions): string {
  const { otp, userName, purpose, expiresInMinutes = 5 } = options;

  let purposeTitle = 'Mã xác thực tài khoản';
  let purposeDescription = 'vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình xác thực';

  if (purpose === OtpPurpose.FORGOT_PASSWORD) {
    purposeTitle = 'Khôi phục mật khẩu';
    purposeDescription = 'chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn';
  } else if (purpose === OtpPurpose.REGISTER) {
    purposeTitle = 'Xác thực đăng ký tài khoản';
    purposeDescription = 'vui lòng xác thực tài khoản của bạn để bắt đầu đặt món ngon';
  }

  const greeting = userName ? `Xin chào <strong>${userName}</strong>,` : 'Xin chào bạn,';

  const bodyContent = `
    <h2 style="color: ${SECONDARY_COLOR}; margin-top: 0;">${purposeTitle}</h2>
    <p>${greeting}</p>
    <p>Bạn vừa thực hiện yêu cầu trên hệ thống, ${purposeDescription}:</p>
    
    <div class="highlight-box">
      <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: ${PRIMARY_COLOR};">${otp}</span>
    </div>

    <p style="font-size: 14px; color: #666666;">
      ⏰ Mã xác thực này có hiệu lực trong vòng <strong>${expiresInMinutes} phút</strong>.
    </p>
    <p style="font-size: 13px; color: #999999; margin-top: 24px; border-top: 1px solid #ECEEF1; padding-top: 16px;">
      ⚠️ Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với bộ phận hỗ trợ của chúng tôi để đảm bảo an toàn cho tài khoản.
    </p>
  `;

  return renderBaseTemplate(purposeTitle, bodyContent);
}

/**
 * Tạo nội dung email Chào mừng
 */
export function renderWelcomeEmailTemplate(options: ISendWelcomeEmailOptions): string {
  const { userName, loginUrl } = options;
  const targetUrl = loginUrl || 'http://localhost:3000';

  const bodyContent = `
    <h2 style="color: ${SECONDARY_COLOR}; margin-top: 0;">Chào mừng bạn đến với ${BRAND_NAME}! 🎉</h2>
    <p>Xin chào <strong>${userName}</strong>,</p>
    <p>Chúc mừng bạn đã tạo tài khoản thành công tại <strong>${BRAND_NAME}</strong>. Từ bây giờ bạn có thể dễ dàng khám phá hàng trăm món ăn nhanh thơm ngon, combo ưu đãi và nhận món tận nơi siêu tốc!</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${targetUrl}" class="btn">Khám Phá Menu Ngay 🚀</a>
    </div>

    <p style="font-size: 14px; color: #555555;">
      💡 Đừng quên kiểm tra mục <strong>Mã giảm giá (Coupons)</strong> để nhận nhiều ưu đãi hấp dẫn dành riêng cho thành viên mới nhé!
    </p>
  `;

  return renderBaseTemplate(`Chào mừng ${userName} đến với ${BRAND_NAME}`, bodyContent);
}

/**
 * Tạo nội dung email Xác nhận đơn hàng
 */
export function renderOrderConfirmationEmailTemplate(options: ISendOrderConfirmationOptions): string {
  const {
    customerName,
    orderCode,
    items,
    totalAmount,
    shippingFee = 0,
    discountAmount = 0,
    finalAmount,
    deliveryAddress,
    paymentMethod = 'COD',
    orderDate = new Date(),
    trackingUrl,
  } = options;

  const formattedDate =
    typeof orderDate === 'string'
      ? orderDate
      : new Intl.DateTimeFormat('vi-VN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(orderDate);

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const itemsRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #ECEEF1;">
        <td style="padding: 10px 0;">
          <strong>${item.name}</strong>
          ${item.variantName ? `<br><small style="color: #888;">Phân loại: ${item.variantName}</small>` : ''}
          ${item.note ? `<br><small style="color: #E67E22;">Ghi chú: ${item.note}</small>` : ''}
        </td>
        <td style="padding: 10px 0; text-align: center; color: #666;">x${item.quantity}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600;">${formatVnd(item.price * item.quantity)}</td>
      </tr>
    `,
    )
    .join('');

  const bodyContent = `
    <h2 style="color: ${SECONDARY_COLOR}; margin-top: 0;">Đặt hàng thành công! 📦</h2>
    <p>Xin chào <strong>${customerName}</strong>,</p>
    <p>Cảm ơn bạn đã đặt món tại <strong>${BRAND_NAME}</strong>. Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình chuẩn bị.</p>

    <div style="background-color: #F8F9FA; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Mã đơn hàng:</strong> <span style="color: ${PRIMARY_COLOR}; font-weight: 700;">#${orderCode}</span></p>
      <p style="margin: 0 0 8px 0;"><strong>Thời gian đặt:</strong> ${formattedDate}</p>
      <p style="margin: 0 0 8px 0;"><strong>Địa chỉ giao hàng:</strong> ${deliveryAddress}</p>
      <p style="margin: 0;"><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
    </div>

    <h3 style="color: ${SECONDARY_COLOR}; margin-bottom: 8px;">Chi tiết món ăn</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <thead>
        <tr style="border-bottom: 2px solid #ECEEF1; color: #777; font-size: 13px; text-align: left;">
          <th style="padding-bottom: 8px;">Món</th>
          <th style="padding-bottom: 8px; text-align: center;">Số lượng</th>
          <th style="padding-bottom: 8px; text-align: right;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div style="border-top: 2px solid #ECEEF1; padding-top: 12px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #666;">Tạm tính:</span>
        <span style="font-weight: 600;">${formatVnd(totalAmount)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="color: #666;">Phí giao hàng:</span>
        <span style="font-weight: 600;">${formatVnd(shippingFee)}</span>
      </div>
      ${
        discountAmount > 0
          ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #27AE60;">
        <span>Giảm giá:</span>
        <span style="font-weight: 600;">-${formatVnd(discountAmount)}</span>
      </div>
      `
          : ''
      }
      <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 17px; font-weight: 700; color: ${PRIMARY_COLOR};">
        <span>Tổng thanh toán:</span>
        <span>${formatVnd(finalAmount)}</span>
      </div>
    </div>

    ${
      trackingUrl
        ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl}" class="btn">Theo Dõi Đơn Hàng 🛵</a>
    </div>
    `
        : ''
    }
  `;

  return renderBaseTemplate(`Xác nhận đơn hàng #${orderCode}`, bodyContent);
}

/**
 * Tạo nội dung email Cập nhật trạng thái đơn hàng
 */
export function renderOrderStatusEmailTemplate(options: {
  customerName: string;
  orderCode: string;
  status: string;
  statusDescription: string;
  finalAmount?: number;
  deliveryAddress?: string;
  trackingUrl?: string;
}): string {
  const { customerName, orderCode, status, statusDescription, finalAmount, deliveryAddress, trackingUrl } = options;

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const bodyContent = `
    <h2 style="color: ${SECONDARY_COLOR}; margin-top: 0;">Cập nhật đơn hàng #${orderCode} 📢</h2>
    <p>Xin chào <strong>${customerName}</strong>,</p>
    <p>Đơn hàng <strong>#${orderCode}</strong> của bạn đã được cập nhật trạng thái mới:</p>

    <div class="highlight-box" style="background-color: #F0F9FF; border-color: #0984E3;">
      <h3 style="margin: 0 0 6px 0; color: #0984E3; font-size: 20px;">${status}</h3>
      <p style="margin: 0; color: #555; font-size: 14px;">${statusDescription}</p>
    </div>

    ${
      finalAmount || deliveryAddress
        ? `
    <div style="background-color: #F8F9FA; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 14px;">
      ${finalAmount ? `<p style="margin: 0 0 6px 0;"><strong>Tổng tiền:</strong> ${formatVnd(finalAmount)}</p>` : ''}
      ${deliveryAddress ? `<p style="margin: 0;"><strong>Địa chỉ giao:</strong> ${deliveryAddress}</p>` : ''}
    </div>
    `
        : ''
    }

    ${
      trackingUrl
        ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl}" class="btn">Xem Chi Tiết Đơn Hàng 🔍</a>
    </div>
    `
        : ''
    }
  `;

  return renderBaseTemplate(`Cập nhật đơn hàng #${orderCode}: ${status}`, bodyContent);
}

/**
 * Tạo nội dung email Thông báo mã giảm giá / Khuyến mãi
 */
export function renderCouponNotificationEmailTemplate(options: {
  userName?: string;
  couponCode: string;
  discountDisplay: string;
  minOrderValue?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
  usageUrl?: string;
}): string {
  const { userName, couponCode, discountDisplay, minOrderValue, endDate, description, usageUrl } = options;
  const targetUrl = usageUrl || 'http://localhost:3000';

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formattedEndDate = endDate
    ? typeof endDate === 'string'
      ? endDate
      : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(endDate)
    : null;

  const greeting = userName ? `Xin chào <strong>${userName}</strong>,` : 'Xin chào bạn,';

  const bodyContent = `
    <h2 style="color: ${SECONDARY_COLOR}; margin-top: 0;">Ưu đãi đặc biệt dành cho bạn! 🎁</h2>
    <p>${greeting}</p>
    <p>${description || `FastFood Delivery tặng bạn mã ưu đãi cực hot <strong>${discountDisplay}</strong>. Đừng bỏ lỡ cơ hội thưởng thức món ngon với giá siêu hời!`}</p>

    <div class="highlight-box">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Mã giảm giá của bạn</p>
      <span style="font-size: 28px; font-weight: 800; letter-spacing: 4px; color: ${PRIMARY_COLOR};">${couponCode}</span>
      <p style="margin: 6px 0 0 0; font-weight: 600; color: #27AE60;">Giảm: ${discountDisplay}</p>
    </div>

    <div style="background-color: #F8F9FA; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 14px; color: #555;">
      ${minOrderValue && minOrderValue > 0 ? `<p style="margin: 0 0 6px 0;">🏷️ <strong>Áp dụng cho đơn từ:</strong> ${formatVnd(minOrderValue)}</p>` : ''}
      ${formattedEndDate ? `<p style="margin: 0;">⏰ <strong>Hạn sử dụng:</strong> đến ngày <strong>${formattedEndDate}</strong></p>` : ''}
    </div>

    <div style="text-align: center; margin: 26px 0;">
      <a href="${targetUrl}" class="btn">Dùng Mã Đặt Món Ngay 🍕</a>
    </div>
  `;

  return renderBaseTemplate(`Quà tặng voucher ${couponCode} - Giảm ${discountDisplay}`, bodyContent);
}
