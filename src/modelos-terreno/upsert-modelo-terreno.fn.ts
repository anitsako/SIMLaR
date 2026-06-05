import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosModelosTerrenoTable } from '@/db/schemas/proyectos-mineros-modelos-terreno.schema';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

// Schema de un COG en el payload
const cogArchivoSchema = z.object({
  nombre: z.string().min(1).max(500),
  tamaño: z.number().int().positive(),
  mimeType: z.string().min(1).max(100),
  base64: z.string().min(1),
});

const upsertModeloTerrenoSchema = z.object({
  proyectoMineroId: z.number().int().positive(),
  nombre: z.string().min(1).max(200).default('Levantamiento inicial'),

  // Los tres COG, todos opcionales
  mdtCog: cogArchivoSchema.nullable().optional(),
  ortofotoCog: cogArchivoSchema.nullable().optional(),
  mdtColoreadoCog: cogArchivoSchema.nullable().optional(),

  // Archivos nuevos para 3D
  mdtRaw: cogArchivoSchema.nullable().optional(),         // GeoTIFF Float32 sin convertir a COG
  ortofotoPng: cogArchivoSchema.nullable().optional(),    // PNG/JPG para textura

  // Metadata espacial (extraída en el front con geotiff.js)
  crs: z.string().default('EPSG:3857'),
  boundsWest: z.number(),
  boundsSouth: z.number(),
  boundsEast: z.number(),
  boundsNorth: z.number(),
  centerLat: z.number(),
  centerLon: z.number(),
  defaultZoom: z.number().int().min(0).max(24).default(15),
  elevationMin: z.number().nullable(),
  elevationMax: z.number().nullable(),
  resolucionMetros: z.number().nullable(),
  anchoPx: z.number().int().positive().nullable(),
  altoPx: z.number().int().positive().nullable(),
});

const MAX_COG = 60 * 1024 * 1024; // 60MB

export const upsertModeloTerrenoFn = createServerFn({ method: 'POST' })
  .inputValidator(upsertModeloTerrenoSchema)
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

    const { proyectoMineroId, mdtCog, ortofotoCog, mdtColoreadoCog, mdtRaw, ortofotoPng, nombre, ...metadata } = data;

    // Validar tamaños y preparar buffers
    const prepararBuffer = (cog: typeof mdtCog) => {
      if (!cog) return null;
      const buffer = Buffer.from(cog.base64, 'base64');
      if (buffer.length === 0) throw new Error(`El archivo "${cog.nombre}" está vacío`);
      if (buffer.length > MAX_COG) throw new Error(`El archivo "${cog.nombre}" excede 50MB`);
      return { buffer, meta: cog };
    };

    const mdtData = prepararBuffer(mdtCog);
    const ortofotoData = prepararBuffer(ortofotoCog);
    const mdtColoreadoData = prepararBuffer(mdtColoreadoCog);
    const mdtRawData = prepararBuffer(mdtRaw);
    const ortofotoPngData = prepararBuffer(ortofotoPng);


    // Trackear archivos escritos para limpieza si falla
    const archivosEscritos: string[] = [];

    try {
      const resultado = await db.transaction(async (tx) => {
        // Validar que el proyecto exista
        const proyectos = await tx
          .select({ id: proyectosMinerosTable.id })
          .from(proyectosMinerosTable)
          .where(eq(proyectosMinerosTable.id, proyectoMineroId));

        if (proyectos.length === 0) {
          throw new Error('Proyecto minero no encontrado');
        }

        // Buscar si ya hay modelo principal
        const modelosExistentes = await tx
          .select()
          .from(proyectosMinerosModelosTerrenoTable)
          .where(
            and(
              eq(proyectosMinerosModelosTerrenoTable.proyectoMineroId, proyectoMineroId),
              eq(proyectosMinerosModelosTerrenoTable.esPrincipal, true),
            ),
          )
          .limit(1);

        const modeloExistente = modelosExistentes[0] ?? null;

        // Helper: reemplazar (sobrescribir mismo UUID) o crear archivo nuevo
        const upsertArchivo = async (
          archivoIdActual: string | null,
          cogData: { buffer: Buffer; meta: { nombre: string; mimeType: string } } | null,
        ): Promise<string | null> => {
          if (!cogData) {
            // No viene archivo nuevo: dejar el que estaba
            return archivoIdActual;
          }

          if (archivoIdActual) {
            // REEMPLAZAR: mismo UUID, nuevo contenido
            await tx
              .update(archivosTable)
              .set({
                nombre: cogData.meta.nombre,
                tamaño: cogData.buffer.length,
                mimeType: cogData.meta.mimeType,
                usuarioModificadorId: usuarioId,
              })
              .where(eq(archivosTable.id, archivoIdActual));

            const ruta = path.join(filesPath, archivoIdActual);
            await writeFile(ruta, cogData.buffer);
            archivosEscritos.push(ruta);
            return archivoIdActual;
          } else {
            // CREAR archivo nuevo
            const [archivoNuevo] = await tx
              .insert(archivosTable)
              .values({
                nombre: cogData.meta.nombre,
                tamaño: cogData.buffer.length,
                mimeType: cogData.meta.mimeType,
                usuarioCreadorId: usuarioId,
                usuarioModificadorId: usuarioId,
              })
              .returning();

            const ruta = path.join(filesPath, archivoNuevo.id);
            await writeFile(ruta, cogData.buffer);
            archivosEscritos.push(ruta);
            return archivoNuevo.id;
          }
        };

        // Procesar cada archivo (reemplaza o crea según corresponda)
        const mdtCogArchivoId = await upsertArchivo(
          modeloExistente?.mdtCogArchivoId ?? null,
          mdtData,
        );
        const ortofotoCogArchivoId = await upsertArchivo(
          modeloExistente?.ortofotoCogArchivoId ?? null,
          ortofotoData,
        );
        const mdtColoreadoArchivoId = await upsertArchivo(
          modeloExistente?.mdtColoreadoArchivoId ?? null,
          mdtColoreadoData,
        );
        // Dentro de la transacción, junto a los otros upserts de archivo:
        const mdtRawArchivoId = await upsertArchivo(
          modeloExistente?.mdtRawArchivoId ?? null,
          mdtRawData,
        );
        const ortofotoPngArchivoId = await upsertArchivo(
          modeloExistente?.ortofotoPngArchivoId ?? null,
          ortofotoPngData,
        );

        if (modeloExistente) {
          // ACTUALIZAR el modelo existente
          const [actualizado] = await tx
            .update(proyectosMinerosModelosTerrenoTable)
            .set({
              nombre,
              mdtCogArchivoId,
              ortofotoCogArchivoId,
              mdtColoreadoArchivoId,
              mdtRawArchivoId,
              ortofotoPngArchivoId,
              ...metadata,
              usuarioModificadorId: usuarioId,
            })
            .where(eq(proyectosMinerosModelosTerrenoTable.id, modeloExistente.id))
            .returning();
          return actualizado;
        } else {
          // CREAR modelo nuevo
          const [creado] = await tx
            .insert(proyectosMinerosModelosTerrenoTable)
            .values({
              proyectoMineroId,
              nombre,
              mdtCogArchivoId,
              ortofotoCogArchivoId,
              mdtColoreadoArchivoId,
              mdtRawArchivoId,
              ortofotoPngArchivoId,
              ...metadata,
              esPrincipal: true,
              estadoProcesamiento: 'listo',
              usuarioCreadorId: usuarioId,
              usuarioModificadorId: usuarioId,
            })
            .returning();
          return creado;
        }
      });

      return resultado;
    } catch (error) {
      // Limpiar archivos escritos si la transacción falló
      for (const ruta of archivosEscritos) {
        try {
          await unlink(ruta);
        } catch {

        }
      }
      throw error;
    }
  });
