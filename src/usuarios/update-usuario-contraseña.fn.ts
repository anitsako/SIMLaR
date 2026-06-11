import * as bcrypt from 'bcrypt';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

const updateUsuarioContraseñaSchema = z.object({
  passwordOld: z.string().min(8),
  passwordNew: z.string().min(8),
});

export const updateUsuarioContraseñaFn = createServerFn({ method: 'POST' })
  .inputValidator(updateUsuarioContraseñaSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const { usuarioId } = session.data;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const { passwordOld, passwordNew } = data;

    const usuarios = await db.select().from(usuariosTable).where(eq(usuariosTable.id, usuarioId));

    if (usuarios.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(passwordOld, usuario.hashPassword);
    if (!isPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    const hashPassword = await bcrypt.hash(passwordNew, 12);

    await db.update(usuariosTable).set({ hashPassword }).where(eq(usuariosTable.id, usuarioId));
  });
