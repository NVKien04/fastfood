import { JwtPayload } from 'jsonwebtoken';

export type CookieName = 'accessToken' | 'refreshToken' | 'logged_in';

export interface JwtPayLoad extends JwtPayload {
  userId: string;
  role: string;
}

export interface AuthUser {
  userId: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatar?: string;
}
