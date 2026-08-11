import { DEFAULT_API_MAIN_CONFIG } from './config/base.config';
import { setupInterceptors } from './config/interceptors';
import { AuthApiModule } from './module/Auth.api';
import { UserApiModule } from './module/User.api';
import { useAuthStore } from '../../../stores/auth.store';

export class ApiMain {
  private static _instance: ApiMain;

  readonly user = new UserApiModule(DEFAULT_API_MAIN_CONFIG);
  readonly auth = new AuthApiModule(DEFAULT_API_MAIN_CONFIG);

  private constructor() {
    // ─── onRefresh ──────────────────────────────────────────────────
    // Gọi POST /auth/refresh → Cookie tự gửi refreshToken
    // → Nhận accessToken mới → Lưu vào Auth Store
    const onRefresh = async (): Promise<string | null> => {
      const response = await this.auth.refreshToken();
      if (response.kind === 'OK' && response.data?.accessToken) {
        const newToken = response.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        return newToken;
      }
      return null;
    };

    // ─── onLogout ───────────────────────────────────────────────────
    // Xóa token khỏi store → Redirect về trang login
    const onLogout = () => {
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/login';
      }
    };

    // Đăng ký interceptors cho tất cả các module
    setupInterceptors(this.user.api.instance, onRefresh, onLogout);
    setupInterceptors(this.auth.api.instance, onRefresh, onLogout);
  }

  static get instance() {
    if (!ApiMain._instance) ApiMain._instance = new ApiMain();
    return ApiMain._instance;
  }
}
