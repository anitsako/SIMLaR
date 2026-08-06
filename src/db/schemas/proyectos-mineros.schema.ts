import {
  boolean,
  geometry,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { usuariosTable } from './usuarios.schema';
import { archivosTable } from './archivos.schema';
import { proyectosMinerosTiposTable } from './proyectos-mineros-tipos.schema';
import { proyectosMinerosEtapasTable } from './proyectos-mineros-etapas.schema';

export const proyectosMinerosTable = pgTable('proyectos_mineros', {
  id: serial('id').primaryKey(),

  nombre: varchar('nombre', {
    length: 100,
  })
    .notNull()
    .unique(),

  tipoId: integer('tipo_id')
    .notNull()
    .references(() => proyectosMinerosTiposTable.id),

  ubicacion: varchar('ubicacion', {
    length: 100,
  }).notNull(),

  provinciaGeologica: varchar('provincia_geologica', {
    length: 100,
  }).notNull(),

  /*
   * Campo anterior. Se conserva temporalmente para no perder
   * los datos existentes mientras se realiza la migración.
   */
  area: varchar('area', {
    length: 10,
  }).notNull(),

  /*
   * Nuevo campo numérico para cálculos y estadísticas.
   * Queda nullable hasta completar los proyectos existentes.
   */
  areaHectareas: numeric('area_hectareas', {
    precision: 14,
    scale: 2,
    mode: 'number',
  }),

  litologia: text('litologia').notNull(),

  mineralizacion: text('mineralizacion').notNull(),

  mineralInteres: varchar('mineral_interes', {
    length: 100,
  }).notNull(),

  modeloGenetico: text('modelo_genetico').notNull(),

  accesos: text('accesos').notNull(),

  etapaId: integer('etapa_id')
    .notNull()
    .references(() => proyectosMinerosEtapasTable.id),

  propietario: varchar('propietario', {
    length: 100,
  }).notNull(),

  localidadesCercanas: varchar('localidades_cercanas', {
    length: 100,
  }).notNull(),

  coordenadasGeograficas: geometry('coordenadas_geograficas', {
    type: 'point',
    srid: 4326,
  }).notNull(),

  msnm: integer('msnm').notNull(),

  convenioEmse: boolean('convenio_emse').notNull(),

  archivoMapaId: uuid('archivo_mapa_id')
    .notNull()
    .references(() => archivosTable.id),

  visible: boolean('visible')
    .notNull()
    .default(true),

  usuarioCreadorId: integer('usuario_creador_id')
    .notNull()
    .references(() => usuariosTable.id),

  usuarioModificadorId: integer('usuario_modificador_id')
    .notNull()
    .references(() => usuariosTable.id),

  fechaCreacion: timestamp('fecha_creacion', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  fechaModificacion: timestamp('fecha_modificacion', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});