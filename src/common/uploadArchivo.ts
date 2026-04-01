import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '@/db';
import { useAppSession } from '@/auth/use-app-session';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';
import { detectImageMime } from '@/common/detect-image-mime';

const uploadArchivoSchema = z.object({
  archivo: z.object({
    nombre: z.string(),
    tamaño: z.number(),
    mimeType: z.string(),
    base64: z.string(),
  }),
});

export const uploadArchivoFn = createServerFn({ method: 'POST' })
  .inputValidator(uploadArchivoSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const { archivo } = data;

    const buffer = Buffer.from(archivo.base64, 'base64');

    const maxSize = 5 * 1024 * 1024;

    if (buffer.length > maxSize) {
      throw new Error('El archivo supera los 5MB');
    }

    const mimeDetectado = detectImageMime(buffer);

    if (!mimeDetectado) {
      throw new Error('Archivo no es una imagen válida');
    }

    const nuevoArchivo = await db.transaction(async (tx) => {
      const [archivoInsertado] = await tx
        .insert(archivosTable)
        .values({
          nombre: archivo.nombre,
          tamaño: buffer.length,
          mimeType: mimeDetectado,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning();

      await tx.insert(archivosContenidosTable).values({
        archivoId: archivoInsertado.id,
        contenido: buffer,
      });

      return archivoInsertado;
    });

    return {
      archivoId: nuevoArchivo.id,
      nombre: nuevoArchivo.nombre,
    };
  });
