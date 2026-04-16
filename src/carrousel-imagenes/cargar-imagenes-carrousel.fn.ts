import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { inArray } from 'drizzle-orm';
import { db } from '@/db';
import { useAppSession } from '@/auth/use-app-session';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { archivosContenidosTable } from '@/db/schemas/archivos-contenidos.schema';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

const cargarImagenesCarrouselSchema = z.object({
  imagenes: z
    .array(
      z.object({
        archivoId: z.string().uuid(),
        positionY: z.number().int(),
        orden: z.number().int(),
      })
    )
    .length(4), // Exactamente 4 imágenes
});

export const cargarImagenesCarrouselFn = createServerFn({ method: 'POST' })
  .inputValidator(cargarImagenesCarrouselSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    // Validar que todos los archivos existen
    const archivos = await db
      .select()
      .from(archivosTable)
      .where(
        inArray(
          archivosTable.id,
          data.imagenes.map((img) => img.archivoId)
        )
      );
    const archivoIds = new Set(archivos.map((a) => a.id));

    for (const img of data.imagenes) {
      if (!archivoIds.has(img.archivoId)) {
        throw new Error(`Archivo no encontrado: ${img.archivoId}`);
      }
    }

    // Obtener los archivos actuales del carrusel para borrarlos después
    const archivosActuales = await db.select().from(carrouselImagenesTable);

    const archivosActualesIds: Array<string> = [];
    for (const img of archivosActuales) {
      archivosActualesIds.push(img.archivoId);
    }
    const archivosNuevosIds: Array<string> = [];
    for (const img of data.imagenes) {
      archivosNuevosIds.push(img.archivoId);
    }

    // Archivos vinculados con proyectos mineros (para NO borrarlos)
    const archivosVinculadosConProyectos = await db
      .select({ archivoId: proyectosMinerosTable.archivoMapaId })
      .from(proyectosMinerosTable)
      .where(inArray(proyectosMinerosTable.archivoMapaId, archivosActualesIds));

    const archivosProyectosIds: Array<string> = [];
    for (const a of archivosVinculadosConProyectos) {
      if (a.archivoId) {
        archivosProyectosIds.push(a.archivoId);
      }
    }

    // Archivos a eliminar (los que estaban antes pero no están en la nueva carga Y no están vinculados con proyectos)
    const archivosAEliminar: Array<string> = [];
    for (const id of archivosActualesIds) {
      if (!archivosNuevosIds.includes(id) && !archivosProyectosIds.includes(id)) {
        archivosAEliminar.push(id);
      }
    }

    // Borrar del carrusel
    await db.delete(carrouselImagenesTable);

    // Borrar en cascada solo los archivos que NO están vinculados
    if (archivosAEliminar.length > 0) {
      await db.delete(archivosContenidosTable).where(inArray(archivosContenidosTable.archivoId, archivosAEliminar));
      await db.delete(archivosTable).where(inArray(archivosTable.id, archivosAEliminar));
    }

    // Insertar las 4 nuevas imágenes
    const resultado = await db
      .insert(carrouselImagenesTable)
      .values(
        data.imagenes.map((img, index) => ({
          archivoId: img.archivoId,
          positionY: img.positionY,
          orden: index,
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        }))
      )
      .returning();

    return resultado;
  });
