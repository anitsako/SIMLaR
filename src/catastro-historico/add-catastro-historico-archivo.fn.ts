import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from "@tanstack/react-start";
import { z } from 'zod';
import { db } from '@/db'
import { catastroHistoricoTable } from "@/db/schemas/catastro-historico";
import { archivosTable } from "@/db/schemas/archivos.schema";
import { useAppSession } from "@/auth/use-app-session";

const addArchivoCatastroSchema = z.object({
  anio: z.number().int().min(2020).max(new Date().getFullYear()).positive(),
  mes: z.number().int().positive(),
  archivo: z.object({
    nombre: z.string().min(1).max(500),
    tamaño: z.number().int().positive(),
    mimeType: z.string().min(1).max(100),
    base64: z.string().min(1),
  }),
})

export const addCatastroHistoricoArchivoFn = createServerFn({ method: 'POST' }).
  validator(addArchivoCatastroSchema).
  handler(async ({ data }) => {

    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) throw new Error('Usuario no autenticado');

    const filesPath = process.env.FILES_PATH;
    if (!filesPath) {
      throw new Error('FILES_PATH no está definida');
    }
    await mkdir(filesPath, { recursive: true });

    const maxTamañoArchivo = 6 * 1024 * 1024;

    const buffer = Buffer.from(data.archivo.base64, 'base64');

    if (buffer.length === 0) {
      throw new Error(`El archivo "${data.archivo.nombre}" está vacío`);
    }

    if (buffer.length > maxTamañoArchivo) {
      throw new Error(`El archivo "${data.archivo.nombre}" excede el tamaño máximo permitido de 6MB`);
    }

    return db.transaction(async (tx) => {
      const [archivo] = await tx
        .insert(archivosTable)
        .values({
          nombre: data.archivo.nombre,
          tamaño: buffer.length,
          mimeType: 'image/vnd.dwg',
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning({
          id: archivosTable.id,
          nombre: archivosTable.nombre,
          mimeType: archivosTable.mimeType,
        });


      const [catastro] = await tx
        .insert(catastroHistoricoTable)
        .values({
          anio: data.anio,
          mes: data.mes,
          archivoId: archivo.id
        })
        .returning({
          anio: catastroHistoricoTable.anio,
          mes: catastroHistoricoTable.mes,
          archivoId: catastroHistoricoTable.archivoId
        })
      await writeFile(path.join(filesPath, archivo.id), buffer);

      return {
        ...catastro,
        nombre: archivo.nombre,
        mimeType: archivo.mimeType,
      }
    })

  })
