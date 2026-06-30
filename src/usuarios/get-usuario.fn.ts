import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

export const getUsuarioFn = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return db
      .select({
        id: usuariosTable.id,
        username: usuariosTable.username,
        apellido: usuariosTable.apellido,
        nombre: usuariosTable.nombre,
        email: usuariosTable.email,
        esAdmin: usuariosTable.esAdmin,
        activo: usuariosTable.activo,
      })
      .from(usuariosTable)
      .where(eq(usuariosTable.id, data.id))
      .then((r) => r[0] ?? null);
  });
