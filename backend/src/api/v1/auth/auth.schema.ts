import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    name: z.string().min(1, 'El nombre es requerido').trim(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),
};
