import { pgTable, serial, integer, varchar, text, doublePrecision, boolean, date, timestamp, uuid } from "drizzle-orm/pg-core";
import { proyectosMinerosTable } from "./proyectos-mineros.schema";
import { archivosTable } from "./archivos.schema";
import { usuariosTable } from "./usuarios.schema";

export const proyectosMinerosModelosTerrenoTable = pgTable('modelos_terreno', {
  id: serial('id').primaryKey(),

  proyectoMineroId: integer('proyecto_id')
    .notNull()
    .references(() => proyectosMinerosTable.id, { onDelete: 'cascade' }),
  // Identificación del levantamiento
  nombre: varchar('nombre', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  fechaLevantamiento: date('fecha_levantamiento'),

  // Referencias a archivos (todas nullables: no todos los modelos tienen todo)
  mdtCogArchivoId: uuid('mdt_cog_archivo_id').references(() => archivosTable.id),
  mdtRawArchivoId: uuid('mdt_raw_archivo_id').references(() => archivosTable.id),
  ortofotoCogArchivoId: uuid('ortofoto_cog_archivo_id').references(() => archivosTable.id),
  ortofotoPngArchivoId: uuid('ortofoto_png_archivo_id').references(() => archivosTable.id),
  mdtColoreadoArchivoId: uuid('mdt_coloreado_archivo_id').references(() => archivosTable.id),
  thumbnailArchivoId: uuid('thumbnail_archivo_id').references(() => archivosTable.id),

  // Sistema de coordenadas
  crs: varchar('crs', { length: 50 }).default('EPSG:3857'),
  crsOriginal: varchar('crs_original', { length: 50 }),

  // Bounding box en EPSG:4326 (lat/lon)
  boundsWest: doublePrecision('bounds_west'),
  boundsSouth: doublePrecision('bounds_south'),
  boundsEast: doublePrecision('bounds_east'),
  boundsNorth: doublePrecision('bounds_north'),

  // Centro y zoom para visualización inicial
  centerLat: doublePrecision('center_lat'),
  centerLon: doublePrecision('center_lon'),
  defaultZoom: integer('default_zoom').default(15),

  // Características del raster
  elevationMin: doublePrecision('elevation_min'),
  elevationMax: doublePrecision('elevation_max'),
  resolucionMetros: doublePrecision('resolucion_metros'),
  anchoPx: integer('ancho_px'),
  altoPx: integer('alto_px'),

  // Metadata del procesamiento
  softwareProcesamiento: varchar('software_procesamiento', { length: 100 }),
  versionSoftware: varchar('version_software', { length: 50 }),
  notasProcesamiento: text('notas_procesamiento'),

  // Estado
  visible: boolean('visible').default(true),
  esPrincipal: boolean('es_principal').default(false),
  estadoProcesamiento: varchar('estado_procesamiento', { length: 50 }).default('pendiente'),

  // Auditoría (consistente con tus otras tablas)
  usuarioCreadorId: integer('usuario_creador_id').references(() => usuariosTable.id),
  usuarioModificadorId: integer('usuario_modificador_id').references(() => usuariosTable.id),
  fechaCreacion: timestamp('fecha_creacion').defaultNow(),
  fechaModificacion: timestamp('fecha_modificacion').defaultNow(),
})


