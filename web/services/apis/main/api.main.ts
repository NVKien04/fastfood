import { DEFAULT_API_MAIN_CONFIG } from './config/base.config';
import { setupInterceptors } from './config/interceptors';
import { AuthApiModule } from './module/Auth.api';
import { UserApiModule } from './module/User.api';
import { ProductApiModule } from './module/Product.api';
import { CategoryApiModule } from './module/Category.api';
import { UploadApiModule } from './module/Upload.api';
import { OrderApiModule } from './module/Order.api';
import { useStore } from '@/stores';

export class ApiMain {
  private static _instance: ApiMain;

  readonly user = new UserApiModule(DEFAULT_API_MAIN_CONFIG);
  readonly auth = new AuthApiModule(DEFAULT_API_MAIN_CONFIG);
  readonly product = new ProductApiModule(DEFAULT_API_MAIN_CONFIG);
  readonly category = new CategoryApiModule(DEFAULT_API_MAIN_CONFIG);
  readonly upload = new UploadApiModule(DEFAULT_API_MAIN_CONFIG);
  readonly order = new OrderApiModule(DEFAULT_API_MAIN_CONFIG);

  private constructor() {
    // ─── onRefresh ──────────────────────────────────────────────────
    // Gọi POST /auth/refresh → Cookie tự gửi refreshToken
    // → Nhận accessToken mới → Lưu vào Auth Store
    const onRefresh = async (): Promise<string | null> => {
      const response = await this.auth.refreshToken();
      if (response.kind === 'OK' && response.data?.accessToken) {
        const newToken = response.data.accessToken;
        useStore.getState().setAccessToken(newToken);
        return newToken;
      }
      return null;
    };

    // ─── onLogout ───────────────────────────────────────────────────
    // Xóa token khỏi store → Redirect về trang login
    const onLogout = () => {
      useStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/login';
      }
    };

    // Đăng ký interceptors cho tất cả các module
    setupInterceptors(this.user.api.instance, onRefresh, onLogout);
    setupInterceptors(this.auth.api.instance, onRefresh, onLogout);
    setupInterceptors(this.product.api.instance, onRefresh, onLogout);
    setupInterceptors(this.category.api.instance, onRefresh, onLogout);
    setupInterceptors(this.upload.http.instance, onRefresh, onLogout);
    setupInterceptors(this.order.http.instance, onRefresh, onLogout);
  }

  static get instance() {
    if (!ApiMain._instance) ApiMain._instance = new ApiMain();
    return ApiMain._instance;
  }
}
