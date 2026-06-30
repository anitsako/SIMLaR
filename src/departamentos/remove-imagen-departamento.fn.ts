import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { departamentosTable } from '@/db/schemas/departamentos.schema';

const removeImagenDepartamentoSchema = z.object({
  departamentoId: z.number().int().positive(),
});

export const removeImagenDepartamentoFn = createServerFn({ method: 'POST' })
  .validator(removeImagenDepartamentoSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const filesPath = process.env.FILES_PATH;
    if (!filesPath) {
      throw new Error('FILES_PATH no está definida');
    }

    return db.transaction(async (tx) => {
      const departamentos = await tx
        .select({ id: departamentosTable.id, archivoImagenId: departamentosTable.archivoImagenId })
        .from(departamentosTable)
        .where(eq(departamentosTable.id, data.departamentoId))
        .limit(1);

      if (departamentos.length === 0) {
        throw new Error('Departamento no encontrado');
      }

      const departamento = departamentos[0];

      if (!departamento.archivoImagenId) {
        throw new Error('El departamento no tiene una imagen cargada');
      }

      await tx
        .update(departamentosTable)
        .set({ archivoImagenId: null })
        .where(eq(departamentosTable.id, data.departamentoId));
      await tx.delete(archivosTable).where(eq(archivosTable.id, departamento.archivoImagenId));

      try {
        await unlink(path.join(filesPath, departamento.archivoImagenId));
      } catch (error) {
        const isEnoent = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
        if (!isEnoent) {
          throw error;
        }
      }

      return { departamentoId: data.departamentoId };
    });
  });
