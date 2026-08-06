import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createServerFn } from '@tanstack/react-start';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { detectImageMime } from '@/common/detect-image-mime';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { galeriaFotosTable } from '@/db/schemas/galeria-fotos';

const addGaleriaFotoSchema = z.object({
  descripcion: z.string().min(1).max(500),
  archivo: z.object({
    nombre: z.string().min(1).max(500),
    tamaño: z.number().int().positive(),
    mimeType: z.string().min(1).max(100),
    base64: z.string().min(1),
  }),
});

export const addGaleriaFotoFn = createServerFn({ method: 'POST' })
  .validator(addGaleriaFotoSchema)
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
    const maxSize = 10 * 1024 * 1024;

    if (buffer.length === 0) {
      throw new Error('Archivo vacío');
    }

    if (buffer.length > maxSize) {
      throw new Error('El archivo supera los 10MB');
    }

    const mimeDetectado = detectImageMime(buffer);
    if (!mimeDetectado) {
      throw new Error('Archivo no es una imagen válida');
    }

    const thumbnailBuffer = await sharp(buffer).resize(200, 200, { fit: 'cover', position: 'centre' }).toBuffer();

    return await db.transaction(async (tx) => {
      const [ordenActual] = await tx
        .select({ maxOrden: sql<number>`coalesce(max(${galeriaFotosTable.orden}), -1)` })
        .from(galeriaFotosTable);

      const [archivoImagen] = await tx
        .insert(archivosTable)
        .values({
          nombre: data.archivo.nombre,
          tamaño: buffer.length,
          mimeType: mimeDetectado,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning({ id: archivosTable.id });

      await writeFile(path.join(filesPath, archivoImagen.id), buffer);

      const [archivoImagenMiniatura] = await tx
        .insert(archivosTable)
        .values({
          nombre: `miniatura-${data.archivo.nombre}`,
          tamaño: thumbnailBuffer.length,
          mimeType: mimeDetectado,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning({ id: archivosTable.id });

      await writeFile(path.join(filesPath, archivoImagenMiniatura.id), thumbnailBuffer);

      const [foto] = await tx
        .insert(galeriaFotosTable)
        .values({
          orden: ordenActual.maxOrden + 1,
          descripcion: data.descripcion,
          archivoImagenId: archivoImagen.id,
          archivoImagenMiniaturaId: archivoImagenMiniatura.id,
          usuarioCreadorId: usuarioId,
        })
        .returning({
          id: galeriaFotosTable.id,
          orden: galeriaFotosTable.orden,
          descripcion: galeriaFotosTable.descripcion,
          archivoImagenId: galeriaFotosTable.archivoImagenId,
          archivoImagenMiniaturaId: galeriaFotosTable.archivoImagenMiniaturaId,
        });

      return foto;
    });
  });
