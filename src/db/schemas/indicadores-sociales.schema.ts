import { sql } from 'drizzle-orm';
import {
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { departamentosTable } from './departamentos.schema';

export type PoblacionPorEdadSexo = {
  grupoEdad: string;
  mujeres: number;
  varones: number;
};

export type OcupacionPorCategoria = {
  categoria: string;
  mujeres: number;
  varones: number;
};

export type OcupacionPorEdadSexo = {
  grupoEdad: string;
  mujeres: number;
  varones: number;
};

export const indicadoresSocialesTable = pgTable(
  'indicadores_sociales',
  {
    id: serial('id').primaryKey(),

    departamentoId: integer('departamento_id')
      .notNull()
      .unique()
      .references(() => departamentosTable.id, {
        onDelete: 'cascade',
      }),

    poblacion2010: integer('poblacion_2010'),

    poblacion2022: integer('poblacion_2022'),

    mujeres2022: integer('mujeres_2022'),

    varones2022: integer('varones_2022'),

    edadMedianaTotal: doublePrecision('edad_mediana_total'),

    edadMedianaMujeres: doublePrecision('edad_mediana_mujeres'),

    edadMedianaVarones: doublePrecision('edad_mediana_varones'),

    poblacionPorEdadSexo: jsonb('poblacion_por_edad_sexo')
      .$type<Array<PoblacionPorEdadSexo>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    ocupacionPorCategoria: jsonb('ocupacion_por_categoria')
      .$type<Array<OcupacionPorCategoria>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    ocupacionPorEdadSexo: jsonb('ocupacion_por_edad_sexo')
      .$type<Array<OcupacionPorEdadSexo>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    fuente: text('fuente')
      .notNull()
      .default('INDEC - Censo Nacional de Población, Hogares y Viviendas 2022'),

    observaciones: text('observaciones'),

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
  }
);