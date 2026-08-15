import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useStore } from '@/stores';

let refreshPromise: Promise<string | null> | null = null;

export const setupInterceptors = (
  instance: AxiosInstance,
  onRefresh: () => Promise<string | null>,
  onLogout: () => void,
) => {
  // ─── REQUEST INTERCEPTOR ──────────────────────────────────────────
  // Đọc Access Token từ Auth Store (memory) và inject vào header
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useStore.getState().accessToken;
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  // ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────
  // Bắt lỗi 401 → dùng refreshPromise để làm mới token → retry request
  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const axiosError = error as {
        response?: { status: number };
        config?: InternalAxiosRequestConfig & { _retry?: boolean };
      };

      const originalRequest = axiosError.config;

      // Bỏ qua nếu:
      // - Không có response (lỗi mạng)
      // - Không phải 401 Unauthorized
      // - Request đã retry rồi (tránh vòng lặp vô hạn)
      // - Chính request login/refresh bị lỗi
      if (
        !originalRequest ||
        !axiosError.response ||
        axiosError.response.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        return Promise.reject(error);
      }

      // Đánh dấu request này đã retry
      originalRequest._retry = true;

      try {
        // Nếu chưa có refreshPromise → tạo mới
        // Nếu đã có → tái sử dụng (nhiều request 401 cùng lúc đều await cùng 1 promise)
        if (!refreshPromise) {
          refreshPromise = onRefresh().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        if (newAccessToken) {
          // Token mới đã được lưu vào Auth Store bởi onRefresh
          // Khi retry, Request Interceptor sẽ tự động đọc token mới từ store và inject
          return instance.request(originalRequest);
        } else {
          onLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        onLogout();
        return Promise.reject(refreshError);
      }
    },
  );
};
