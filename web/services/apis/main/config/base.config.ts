import { AxiosRequestConfig } from 'axios';

export const DEFAULT_API_MAIN_CONFIG: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_MAIN_URL || 'http://localhost:3001',
  withCredentials: true,
};
