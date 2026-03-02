import { pgTable, serial, uuid } from 'drizzle-orm/pg-core';
import { archivosTable } from './archivos.schema';

export const carrouselImagenesTable = pgTable('carrousel_imagenes', {
    id: serial('id').primaryKey(),
    archivoId: uuid('archivo_id')
        .notNull()
        .references(() => archivosTable.id),
})