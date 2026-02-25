import { boolean, geometry, integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usuariosTable } from './usuarios.schema';
import { archivosTable } from './archivos.schema';

export const proyectosMinerosTable = pgTable('proyectos_mineros', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull().unique(),
  ubicacion: varchar('ubicacion', { length: 100 }).notNull(),
  provinciaGeologica: varchar('provincia_geologica', { length: 100 }).notNull(),
  area: varchar('area', { length: 10 }).notNull(),
  litologia: text('litologia').notNull(),
  mineralizacion: text('mineralizacion').notNull(),
  mineralInteres: varchar('mineral_interes', { length: 100 }).notNull(),
  modeloGenetico: text('modelo_genetico').notNull(),
  accesos: text('accesos').notNull(),
  etapa: varchar('etapa', { length: 100 }).notNull(),
  propietario: varchar('propietario', { length: 100 }).notNull(),
  localidadesCercanas: varchar('localidades_cercanas', { length: 100 }).notNull(),
  coordenadasGeograficas: geometry('coordenadas_geograficas', { type: 'point', srid: 4326 }).notNull(),
  msnm: integer('msnm').notNull(),
  convenioEmse: boolean('convenio_emse').notNull(),
  archivoMapaId: uuid('archivo_mapa_id').references(() => archivosTable.id),
  usuarioCreadorId: integer('usuario_creador_id')
    .notNull()
    .references(() => usuariosTable.id),
  usuarioModificadorId: integer('usuario_modificador_id')
    .notNull()
    .references(() => usuariosTable.id),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaModificacion: timestamp('fecha_modificacion', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
