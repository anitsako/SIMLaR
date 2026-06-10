import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { detectImageMime } from '@/common/detect-image-mime';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { departamentosTable } from '@/db/schemas/departamentos.schema';

const updateImagenDepartamentoSchema = z.object({
  departamentoId: z.number().int().positive(),
  archivo: z.object({
    nombre: z.string().min(1).max(500),
    tamaño: z.number().int().positive(),
    mimeType: z.string().min(1).max(100),
    base64: z.string().min(1),
  }),
});

export const updateImagenDepartamentoFn = createServerFn({ method: 'POST' })
  .inputValidator(updateImagenDepartamentoSchema)
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
    await mkdir(filesPath, { recursive: true });

    const buffer = Buffer.from(data.archivo.base64, 'base64');
    const maxSize = 5 * 1024 * 1024;

    if (buffer.length === 0) {
      throw new Error('Archivo vacío');
    }

    if (buffer.length > maxSize) {
      throw new Error('El archivo supera los 5MB');
    }

    const mimeDetectado = detectImageMime(buffer);
    if (!mimeDetectado) {
      throw new Error('Archivo no es una imagen válida');
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
        .update(archivosTable)
        .set({
          nombre: data.archivo.nombre,
          tamaño: buffer.length,
          mimeType: mimeDetectado,
          usuarioModificadorId: usuarioId,
        })
        .where(eq(archivosTable.id, departamento.archivoImagenId));

      await writeFile(path.join(filesPath, departamento.archivoImagenId), buffer);

      return {
        departamentoId: data.departamentoId,
        archivoImagen: {
          id: departamento.archivoImagenId,
          nombre: data.archivo.nombre,
        },
      };
    });
  });
