import { createFileRoute } from '@tanstack/react-router';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';

export const Route = createFileRoute('/archivos/$id/$nombre')({
  server: {
    handlers: {
      GET: async ({ params }) => {
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

        // Obtener el contenido del archivo
        const archivosContenidos = await db
          .select({ id: archivosContenidosTable, contenido: archivosContenidosTable.contenido })
          .from(archivosContenidosTable)
          .where(eq(archivosContenidosTable.archivoId, id));

        if (archivosContenidos.length === 0) {
          return new Response('Contenido del archivo no encontrado', { status: 404 });
        }

        const archivoContenido = archivosContenidos[0];

        // Retornar el archivo con los headers apropiados
        return new Response(new Uint8Array(archivoContenido.contenido), {
          status: 200,
          headers: {
            'Content-Type': archivo.mimeType,
            'Content-Length': archivo.tamaño.toString(),
            'Content-Disposition': `inline; filename="${archivo.nombre}"`,
          },
        });
      },
    },
  },
});
