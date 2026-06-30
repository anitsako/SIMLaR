import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

const createUsuarioSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(8),
  apellido: z.string().min(1).max(50),
  nombre: z.string().min(1).max(50),
  email: z.email().min(1).max(250),
  esAdmin: z.boolean(),
  activo: z.boolean().default(true),
});

export const createUsuarioFn = createServerFn({ method: 'POST' })
  .validator(createUsuarioSchema)
  .handler(async ({ data }) => {
    const { password, ...dataNoPassword } = data;
    const session = await useAppSession();
    const { usuarioId, esAdmin } = session.data;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    if (!esAdmin) {
      throw new Error('Usuario no autorizado');
    }

    const hashPassword = await bcrypt.hash(password, 12);

    try {
      const nuevoUsuario = await db
        .insert(usuariosTable)
        .values({
          ...dataNoPassword,
          hashPassword,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning();
      return nuevoUsuario;
    } catch (e) {
      throw new Error('Error creando el usuario');
    }
  });
