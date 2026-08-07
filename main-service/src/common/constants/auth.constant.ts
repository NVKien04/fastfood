import { JwtPayload } from 'jsonwebtoken';

export type CookieName = 'accessToken' | 'refreshToken';
export interface JwtPayLoad extends JwtPayload {
  userId: string;
  role: string;
}
export interface AuthUser {
  userId: string;
  role: string;
}
