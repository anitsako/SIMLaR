import { geometry, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const puntosExtrasTable = pgTable('puntos_extras', {
  id: serial('id').primaryKey(),
  geom: geometry('geom', { type: 'point', srid: 4326 }).notNull(),
  nombre: varchar('nombre', { length: 254 }).notNull(),
  tipo: varchar('tipo', { length: 254 }).notNull(),
});
