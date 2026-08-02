import * as bcrypt from 'bcrypt';

export class HashUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Mã hóa văn bản thô (Mật khẩu)
   * @param plainText Mật khẩu chưa mã hóa
   * @returns Chuỗi mật khẩu đã được mã hóa bcrypt
   */
  static async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  /**
   * So sánh văn bản thô với chuỗi đã mã hóa
   * @param plainText Mật khẩu nhập vào
   * @param hashedText Mật khẩu lưu trong CSDL
   * @returns boolean (true nếu trùng khớp)
   */
  static async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
