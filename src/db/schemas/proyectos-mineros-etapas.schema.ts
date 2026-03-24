import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { usuariosTable } from './usuarios.schema';

export const proyectosMinerosEtapasTable = pgTable('proyectos_mineros_etapas', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull().unique(),
  color: varchar('color', { length: 50 }).notNull(),
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
