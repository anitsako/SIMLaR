import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usuariosTable } from './usuarios.schema';

export const archivosTable = pgTable('archivos', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 500 }).notNull(),
  tamaño: integer('tamaño').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
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
