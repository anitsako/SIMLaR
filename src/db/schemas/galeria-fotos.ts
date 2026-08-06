import { integer, pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { archivosTable } from './archivos.schema';
import { usuariosTable } from './usuarios.schema';

export const galeriaFotosTable = pgTable('galeria_fotos', {
  id: serial('id').primaryKey(),
  orden: integer('orden').notNull().default(0),
  descripcion: varchar('descripcion', { length: 500 }).notNull(),
  archivoImagenId: uuid('archivo_imagen_id')
    .notNull()
    .references(() => archivosTable.id),
  archivoImagenMiniaturaId: uuid('archivo_imagen_miniatura_id')
    .notNull()
    .references(() => archivosTable.id),
  usuarioCreadorId: integer('usuario_creador_id')
    .notNull()
    .references(() => usuariosTable.id),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
});
