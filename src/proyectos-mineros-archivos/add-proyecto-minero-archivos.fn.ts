import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosArchivosTable } from '@/db/schemas/proyectos-mineros-archivos.schema';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

const addProyectoMineroArchivosSchema = z.object({
  proyectoMineroId: z.number().int().positive(),
  archivo: z.object({
    nombre: z.string().min(1).max(500),
    tamaño: z.number().int().positive(),
    mimeType: z.string().min(1).max(100),
    base64: z.string().min(1),
  }),
});

export const addProyectoMineroArchivosFn = createServerFn({ method: 'POST' })
  .validator(addProyectoMineroArchivosSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const proyectosMineros = await db
      .select({ id: proyectosMinerosTable.id })
      .from(proyectosMinerosTable)
      .where(eq(proyectosMinerosTable.id, data.proyectoMineroId));

    if (proyectosMineros.length === 0) {
      throw new Error('Proyecto minero no encontrado');
    }

    const filesPath = process.env.FILES_PATH;
    if (!filesPath) {
      throw new Error('FILES_PATH no está definida');
    }
    await mkdir(filesPath, { recursive: true });

    const maxTamañoArchivo = 5 * 1024 * 1024;

    const buffer = Buffer.from(data.archivo.base64, 'base64');

    if (buffer.length === 0) {
      throw new Error(`El archivo "${data.archivo.nombre}" está vacío`);
    }

    if (buffer.length > maxTamañoArchivo) {
      throw new Error(`El archivo "${data.archivo.nombre}" excede el tamaño máximo permitido de 5MB`);
    }

    const archivoNormalizado = {
      nombre: data.archivo.nombre,
      tamaño: buffer.length,
      mimeType: data.archivo.mimeType || 'application/octet-stream',
      contenido: buffer,
    };

    const archivoCreado = await db.transaction(async (tx) => {
      const [archivoInsertado] = await tx
        .insert(archivosTable)
        .values({
          nombre: archivoNormalizado.nombre,
          tamaño: archivoNormalizado.tamaño,
          mimeType: archivoNormalizado.mimeType,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning({ id: archivosTable.id, nombre: archivosTable.nombre, tamaño: archivosTable.tamaño });

      await writeFile(path.join(filesPath, archivoInsertado.id), archivoNormalizado.contenido);

      await tx.insert(proyectosMinerosArchivosTable).values({
        proyectoMineroId: data.proyectoMineroId,
        archivoId: archivoInsertado.id,
        usuarioCreadorId: usuarioId,
      });

      return {
        archivoId: archivoInsertado.id,
        nombre: archivoInsertado.nombre,
        tamaño: archivoInsertado.tamaño,
      };
    });

    return { archivo: archivoCreado };
  });
