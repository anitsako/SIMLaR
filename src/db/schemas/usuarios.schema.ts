import { boolean, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

export const usuariosTable = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  hashPassword: varchar('hash_password', { length: 80 }).notNull(),
  apellido: varchar('apellido', { length: 50 }).notNull(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  email: varchar('email', { length: 250 }),
  esAdmin: boolean('es_admin').default(false).notNull(),
  activo: boolean('activo').default(true).notNull(),
  usuarioCreadorId: integer('usuario_creador_id').references((): AnyPgColumn => usuariosTable.id),
  usuarioModificadorId: integer('usuario_modificador_id').references((): AnyPgColumn => usuariosTable.id),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaModificacion: timestamp('fecha_modificacion', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
