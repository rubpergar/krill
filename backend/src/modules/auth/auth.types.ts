export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
