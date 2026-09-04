import { z } from 'zod';
export const loginSchema = z.object({ email: z.string().trim().email('Ingresá un email válido.'), password: z.string().min(6, 'Usá al menos 6 caracteres.') });
export const registerSchema = z.object({ name: z.string().trim().min(2, 'Ingresá tu nombre.'), email: z.string().trim().email('Ingresá un email válido.'), password: z.string().min(6, 'Usá al menos 6 caracteres.'), confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Las contraseñas no coinciden.' });
export type LoginValues = z.infer<typeof loginSchema>; export type RegisterValues = z.infer<typeof registerSchema>;
