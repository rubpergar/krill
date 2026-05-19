import type { User } from './auth.types.js';

const users = new Map<string, User>();

export const authRepository = {
  findByEmail(email: string): User | undefined {
    return users.get(email.toLowerCase());
  },

  save(user: User): void {
    users.set(user.email.toLowerCase(), user);
  },
};
