import { readFile, stat, open } from 'node:fs/promises';
import path from 'node:path';
import { createFileRoute } from '@tanstack/react-router';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';

export const Route = createFileRoute('/archivos/$id/$nombre')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { id, nombre } = params;

        // Buscar el archivo en la base de datos
        const archivos = await db
          .select({
            id: archivosTable.id,
            nombre: archivosTable.nombre,
            mimeType: archivosTable.mimeType,
            tamaño: archivosTable.tamaño,
          })
          .from(archivosTable)
          .where(eq(archivosTable.id, id));

        if (archivos.length === 0) {
          return new Response('Archivo no encontrado', { status: 404 });
        }

        const archivo = archivos[0];

        // Verificar que el nombre del archivo coincida
        if (archivo.nombre !== nombre) {
          return new Response('Nombre de archivo no coincide', { status: 404 });
        }

        const filesPath = process.env.FILES_PATH;
        if (!filesPath) {
          return new Response('FILES_PATH no está definida', { status: 500 });
        }

        const archivoPath = path.join(filesPath, id);
        // Obtener el tamaño del archivo
        let fileStats;
        try {
          fileStats = await stat(archivoPath);
        } catch (error) {
          if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'ENOENT'
          ) {
            return new Response('Contenido del archivo no encontrado', { status: 404 });
          }
          throw error;
        }
        const fileSize = fileStats.size;
        const rangeHeader = request.headers.get('range');

        // Si viene un header Range (lo que hace el plugin de COG)
        if (rangeHeader) {
          const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
          if (match) {
            const start = parseInt(match[1], 10);
            const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            // Leer solo el rango pedido (sin cargar el archivo entero en memoria)
            const fileHandle = await open(archivoPath, 'r');
            try {
              const buffer = Buffer.alloc(chunkSize);
              await fileHandle.read(buffer, 0, chunkSize, start);

              return new Response(new Uint8Array(buffer), {
                status: 206, // Partial Content
                headers: {
                  'Content-Type': archivo.mimeType,
                  'Content-Length': chunkSize.toString(),
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                },
              });
            } finally {
              await fileHandle.close();
            }
          }
        }

        const contenidoArchivo = await readFile(archivoPath)
        // Retornar el archivo con los headers apropiados
        return new Response(new Uint8Array(contenidoArchivo), {
          status: 200,
          headers: {
            'Content-Type': archivo.mimeType,
            'Content-Length': contenidoArchivo.length.toString(),
            'Content-Disposition': `inline; filename="${archivo.nombre}"`,
            'Accept-Ranges': 'bytes',
          },
        });
      },
    },
  },
});
