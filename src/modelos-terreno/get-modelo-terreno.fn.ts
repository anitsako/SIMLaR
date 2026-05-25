import { createServerFn } from '@tanstack/react-start';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { modelosTerrenoTable } from '@/db/schemas/modelos-terreno.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';

export const getModeloTerrenoFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ proyectoId: z.number().int().positive() }))
  .handler(async ({ data }) => {

    const modelos = await db
      .select()
      .from(modelosTerrenoTable)
      .where(
        and(
          eq(modelosTerrenoTable.proyectoId, data.proyectoId),
          eq(modelosTerrenoTable.esPrincipal, true),
        ),
      )
      .limit(1);

    if (modelos.length === 0) {
      return null; // el proyecto no tiene modelo de terreno
    }

    const modelo = modelos[0];

    // Traer los nombres de los archivos COG (necesarios para construir las URLs)
    const archivoIds = [
      modelo.mdtCogArchivoId,
      modelo.ortofotoCogArchivoId,
      modelo.mdtColoreadoArchivoId,
    ].filter((id): id is string => id !== null);

    const archivos =
      archivoIds.length > 0
        ? await db
          .select({ id: archivosTable.id, nombre: archivosTable.nombre })
          .from(archivosTable)
          .where(inArray(archivosTable.id, archivoIds))
        : [];

    // Mapear id → nombre
    const nombrePorId = new Map(archivos.map((a) => [a.id, a.nombre]));

    return {
      id: modelo.id,
      nombre: modelo.nombre,
      // Archivos con su nombre para construir la URL
      ortofoto:
        modelo.ortofotoCogArchivoId && nombrePorId.has(modelo.ortofotoCogArchivoId)
          ? {
            archivoId: modelo.ortofotoCogArchivoId,
            nombre: nombrePorId.get(modelo.ortofotoCogArchivoId)!,
          }
          : null,
      mdt:
        modelo.mdtCogArchivoId && nombrePorId.has(modelo.mdtCogArchivoId)
          ? {
            archivoId: modelo.mdtCogArchivoId,
            nombre: nombrePorId.get(modelo.mdtCogArchivoId)!,
          }
          : null,
      mdtColoreado:
        modelo.mdtColoreadoArchivoId && nombrePorId.has(modelo.mdtColoreadoArchivoId)
          ? {
            archivoId: modelo.mdtColoreadoArchivoId,
            nombre: nombrePorId.get(modelo.mdtColoreadoArchivoId)!,
          }
          : null,
      // Metadata espacial
      crs: modelo.crs,
      bounds: {
        west: modelo.boundsWest,
        south: modelo.boundsSouth,
        east: modelo.boundsEast,
        north: modelo.boundsNorth,
      },
      center: { lat: modelo.centerLat, lon: modelo.centerLon },
      defaultZoom: modelo.defaultZoom,
      elevation: { min: modelo.elevationMin, max: modelo.elevationMax },
    };
  })
