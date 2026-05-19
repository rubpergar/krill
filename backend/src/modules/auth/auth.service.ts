import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { AppError } from '../../shared/errors/app-error.js';
import { authRepository } from './auth.repository.js';
import type { LoginDto, PublicUser, RegisterDto, User } from './auth.types.js';

function toPublic(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(dto: RegisterDto): Promise<{ user: PublicUser }> {
    const existing = authRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError(409, 'DUPLICATE_EMAIL', 'El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: User = {
      id: randomUUID(),
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      name: dto.name.trim(),
      role: 'user',
      createdAt: new Date(),
    };

    authRepository.save(user);

    return { user: toPublic(user) };
  },

  async login(dto: LoginDto): Promise<{ user: PublicUser }> {
    const user = authRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError(
        401,
        'INVALID_CREDENTIALS',
        'Email o contraseña incorrectos',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new AppError(
        401,
        'INVALID_CREDENTIALS',
        'Email o contraseña incorrectos',
      );
    }

    return { user: toPublic(user) };
  },
};
