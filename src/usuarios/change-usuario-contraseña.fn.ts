import * as bcrypt from 'bcrypt';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

const changeUsuarioContraseñaSchema = z.object({
  id: z.number().int().positive(),
  passwordNew: z.string().min(8),
});

export const changeUsuarioContraseñaFn = createServerFn({ method: 'POST' })
  .validator(changeUsuarioContraseñaSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const { usuarioId, esAdmin } = session.data;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    if (!esAdmin) {
      throw new Error('Usuario no autorizado');
    }

    const { id, passwordNew } = data;

    const usuarios = await db.select().from(usuariosTable).where(eq(usuariosTable.id, id));

    if (usuarios.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const hashPassword = await bcrypt.hash(passwordNew, 12);

    await db.update(usuariosTable).set({ hashPassword }).where(eq(usuariosTable.id, id));
  });
