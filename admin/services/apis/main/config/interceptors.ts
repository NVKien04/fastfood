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

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = onRefresh().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        if (newAccessToken) {
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
