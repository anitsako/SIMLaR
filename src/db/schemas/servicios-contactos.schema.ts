import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { usuariosTable } from './usuarios.schema';

export const serviciosContactosTable = pgTable('servicios_contactos', {
  id: serial('id').primaryKey(),

  nombre: varchar('nombre', { length: 150 }).notNull(),

  descripcion: text('descripcion').notNull().default(''),

  /*
   * Se guarda un trámite por renglón.
   * La interfaz lo transforma en una lista.
   */
  tramites: text('tramites').notNull().default(''),

  direccion: varchar('direccion', { length: 250 }),

  latitud: doublePrecision('latitud'),

  longitud: doublePrecision('longitud'),

  horario: varchar('horario', { length: 150 }),

  telefono: varchar('telefono', { length: 50 }),

  whatsapp: varchar('whatsapp', { length: 50 }),

  email: varchar('email', { length: 150 }),

  sitioWeb: varchar('sitio_web', { length: 300 }),

  facebook: varchar('facebook', { length: 300 }),

  instagram: varchar('instagram', { length: 300 }),

  visible: boolean('visible').notNull().default(false),

  orden: integer('orden').notNull().default(0),

  /*
   * Son nullable para permitir la carga inicial de organismos
   * antes de que un usuario autenticado complete los datos.
   */
  usuarioCreadorId: integer('usuario_creador_id').references(
    () => usuariosTable.id,
  ),

  usuarioModificadorId: integer('usuario_modificador_id').references(
    () => usuariosTable.id,
  ),

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
