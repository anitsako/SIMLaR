import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

const updateUsuarioSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1).max(50),
  apellido: z.string().min(1).max(50),
  nombre: z.string().min(1).max(50),
  email: z.email().min(1).max(250),
  esAdmin: z.boolean(),
  activo: z.boolean().default(true),
});

export const updateUsuarioFn = createServerFn({ method: 'POST' })
  .inputValidator(updateUsuarioSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const { usuarioId, esAdmin } = session.data;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    if (!esAdmin) {
      throw new Error('Usuario no autorizado');
    }

    const { id, ...dataNoId } = data;

    const usuario = await db.transaction(async (tx) => {
      const usuarioExistente = await tx.select().from(usuariosTable).where(eq(usuariosTable.id, id));

      if (usuarioExistente.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const [usuarioActualizado] = await tx
        .update(usuariosTable)
        .set(dataNoId)
        .where(eq(usuariosTable.id, id))
        .returning();

      return usuarioActualizado;
    });
    return usuario;
  });
