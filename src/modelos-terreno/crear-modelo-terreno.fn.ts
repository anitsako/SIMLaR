import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosModelosTerrenoTable } from '@/db/schemas/proyectos-mineros-modelos-terreno.schema';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

const crearModeloTerrenoSchema = z.object({
  proyectoMineroId: z.number().int().positive(),

  // Identificación del levantamiento
  nombre: z.string().min(1).max(200),
  descripcion: z.string().max(2000).optional(),
  fechaLevantamiento: z.string(), // ISO date string (ej: '2026-05-15')

  // Referencias a archivos COG (UUID, ya subidos previamente)
  mdtCogArchivoId: z.uuid().nullable(),
  ortofotoCogArchivoId: z.uuid().nullable(),

  // Sistema de coordenadas
  crs: z.string().default('EPSG:3857'),
  crsOriginal: z.string().optional(),

  // Bounding box (EPSG:4326)
  boundsWest: z.number(),
  boundsSouth: z.number(),
  boundsEast: z.number(),
  boundsNorth: z.number(),

  // Centro y zoom
  centerLat: z.number(),
  centerLon: z.number(),
  defaultZoom: z.number().int().min(0).max(24).default(15),

  // Características del raster
  elevationMin: z.number().nullable(),
  elevationMax: z.number().nullable(),
  resolucionMetros: z.number().nullable(),
  anchoPx: z.number().int().positive().nullable(),
  altoPx: z.number().int().positive().nullable(),

  // Metadata del procesamiento (opcional)
  softwareProcesamiento: z.string().max(100).optional(),
  versionSoftware: z.string().max(50).optional(),

  // Si es el modelo principal del proyecto
  esPrincipal: z.boolean().default(false),
});

export const crearModeloTerrenoFn = createServerFn({ method: 'POST' })
  .validator(crearModeloTerrenoSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const proyectos = await db
      .select({ id: proyectosMinerosTable.id })
      .from(proyectosMinerosTable)
      .where(eq(proyectosMinerosTable.id, data.proyectoMineroId));

    if (proyectos.length === 0) {
      throw new Error('Proyecto minero no encontrado');
    }

    // Validar que al menos un archivo venga (no tiene sentido un modelo vacío)
    if (!data.mdtCogArchivoId && !data.ortofotoCogArchivoId) {
      throw new Error('El modelo de terreno debe tener al menos un archivo (MDT u ortofoto)');
    }

    const modeloCreado = await db.transaction(async (tx) => {
      // Si este modelo va a ser el principal, desmarcar cualquier otro principal del proyecto
      if (data.esPrincipal) {
        await tx
          .update(proyectosMinerosModelosTerrenoTable)
          .set({ esPrincipal: false })
          .where(
            and(
              eq(proyectosMinerosModelosTerrenoTable.proyectoMineroId, data.proyectoMineroId),
              eq(proyectosMinerosModelosTerrenoTable.esPrincipal, true)
            )
          );
      }

      const [modelo] = await tx
        .insert(proyectosMinerosModelosTerrenoTable)
        .values({
          proyectoMineroId: data.proyectoMineroId,
          nombre: data.nombre,
          descripcion: data.descripcion,
          fechaLevantamiento: data.fechaLevantamiento,
          mdtCogArchivoId: data.mdtCogArchivoId,
          ortofotoCogArchivoId: data.ortofotoCogArchivoId,
          crs: data.crs,
          crsOriginal: data.crsOriginal,
          boundsWest: data.boundsWest,
          boundsSouth: data.boundsSouth,
          boundsEast: data.boundsEast,
          boundsNorth: data.boundsNorth,
          centerLat: data.centerLat,
          centerLon: data.centerLon,
          defaultZoom: data.defaultZoom,
          elevationMin: data.elevationMin,
          elevationMax: data.elevationMax,
          resolucionMetros: data.resolucionMetros,
          anchoPx: data.anchoPx,
          altoPx: data.altoPx,
          softwareProcesamiento: data.softwareProcesamiento,
          versionSoftware: data.versionSoftware,
          esPrincipal: data.esPrincipal,
          estadoProcesamiento: 'listo', // ya viene convertido a COG manualmente
          usuarioCreadorId: usuarioId,
          usuarioModificadorId: usuarioId,
        })
        .returning();

      return modelo;
    });

    return modeloCreado;
  });
