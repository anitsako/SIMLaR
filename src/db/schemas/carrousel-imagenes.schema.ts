import { integer, pgTable, serial, uuid } from 'drizzle-orm/pg-core';
import { archivosTable } from './archivos.schema';
import { usuariosTable } from './usuarios.schema';

export const carrouselImagenesTable = pgTable('carrousel_imagenes', {
  id: serial('id').primaryKey(),
  archivoId: uuid('archivo_id')
    .notNull()
    .references(() => archivosTable.id),
  positionY: serial('position_y').notNull(),
  usuarioCreadorId: integer('usuario_creador_id')
    .notNull()
    .references(() => usuariosTable.id),
  usuarioModificadorId: integer('usuario_modificador_id')
    .notNull()
    .references(() => usuariosTable.id),
});
