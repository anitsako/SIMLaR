import { integer, pgTable, serial, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { archivosTable } from './archivos.schema';

export const catastroHistoricoTable = pgTable('catastro_historico', {
  id: serial('id').primaryKey(),
  anio: integer('anio').notNull(),
  mes: integer('mes').notNull(), // 1 a 12
  archivoId: uuid('archivo_id').notNull()
    .references(() => archivosTable.id),
  creadoEn: timestamp('creado_en').defaultNow().notNull(),
}, (t) => ({
  // un solo archivo por año-mes;
  unicoAnioMes: unique().on(t.anio, t.mes),
}))
