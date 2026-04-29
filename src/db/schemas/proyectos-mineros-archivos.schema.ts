import { integer, pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { proyectosMinerosTable } from './proyectos-mineros.schema';
import { archivosTable } from './archivos.schema';
import { usuariosTable } from './usuarios.schema';

export const proyectosMinerosArchivosTable = pgTable(
  'proyectos_mineros_archivos',
  {
    proyectoMineroId: integer('proyecto_minero_id')
      .notNull()
      .references(() => proyectosMinerosTable.id),
    archivoId: uuid('archivo_id')
      .notNull()
      .references(() => archivosTable.id),
    usuarioCreadorId: integer('usuario_creador_id')
      .notNull()
      .references(() => usuariosTable.id),
    fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.proyectoMineroId, t.archivoId] })]
);
