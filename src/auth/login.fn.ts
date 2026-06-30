import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { useAppSession } from './use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

export const loginFn = createServerFn({ method: 'POST' })
  .validator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const { username, password } = data;

    // Obtener usuario
    const usuarios = await db
      .select()
      .from(usuariosTable)
      .where(and(eq(usuariosTable.username, username), eq(usuariosTable.activo, true)));

    // No se valida ingreso si no existe usuario o no está activo
    if (usuarios.length === 0) {
      return { error: 'Credenciales inválidas' };
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.hashPassword);
    if (!isPasswordValid) {
      return { error: 'Credenciales inválidas' };
    }

    // Crear sesion
    const session = await useAppSession();

    await session.update({ usuarioId: usuario.id, esAdmin: usuario.esAdmin });

    // Redirigir a la página principal
    throw redirect({ to: '/' });
  });
