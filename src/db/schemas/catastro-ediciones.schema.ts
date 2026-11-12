import { date, integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { archivosTable } from './archivos.schema';
import { usuariosTable } from './usuarios.schema';

export const catastroEdicionesTable = pgTable('catastro_ediciones', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 120 }).notNull(),
  fechaCorte: date('fecha_corte').notNull(),
  observaciones: text('observaciones').notNull().default(''),
  geojsonId: uuid('geojson_id').notNull().references(() => archivosTable.id),
  pdfId: uuid('pdf_id').references(() => archivosTable.id),
  dwgId: uuid('dwg_id').references(() => archivosTable.id),
  firma: varchar('firma', { length: 64 }).notNull().unique(),
  elementos: integer('elementos').notNull(),
  usuarioId: integer('usuario_id').notNull().references(() => usuariosTable.id),
  publicadaEn: timestamp('publicada_en', { withTimezone: true }).notNull().defaultNow(),
});
