import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { departamentosTable } from '@/db/schemas/departamentos.schema';
import { indicadoresSocialesTable } from '@/db/schemas/indicadores-sociales.schema';

const numeroEnteroNullableSchema = z.number().int().nonnegative().nullable();

const numeroDecimalNullableSchema = z.number().nonnegative().nullable();

const poblacionPorEdadSexoSchema = z.object({
  grupoEdad: z.string().trim().min(1).max(50),
  mujeres: z.number().int().nonnegative(),
  varones: z.number().int().nonnegative(),
});

const ocupacionPorCategoriaSchema = z.object({
  categoria: z.string().trim().min(1).max(100),
  mujeres: z.number().int().nonnegative(),
  varones: z.number().int().nonnegative(),
});

const ocupacionPorEdadSexoSchema = z.object({
  grupoEdad: z.string().trim().min(1).max(50),
  mujeres: z.number().int().nonnegative(),
  varones: z.number().int().nonnegative(),
});

const saveIndicadoresDepartamentoSchema = z.object({
  departamentoId: z.number().int().positive(),

  poblacion2010: numeroEnteroNullableSchema,
  poblacion2022: numeroEnteroNullableSchema,

  mujeres2022: numeroEnteroNullableSchema,
  varones2022: numeroEnteroNullableSchema,

  edadMedianaTotal: numeroDecimalNullableSchema,
  edadMedianaMujeres: numeroDecimalNullableSchema,
  edadMedianaVarones: numeroDecimalNullableSchema,

  poblacionPorEdadSexo: z.array(poblacionPorEdadSexoSchema).default([]),

  ocupacionPorCategoria: z
    .array(ocupacionPorCategoriaSchema)
    .default([]),

  ocupacionPorEdadSexo: z
    .array(ocupacionPorEdadSexoSchema)
    .default([]),

  fuente: z.string().trim().min(1).max(500),

  observaciones: z.string().trim().max(2000).nullable(),
});

export const saveIndicadoresDepartamentoFn = createServerFn({
  method: 'POST',
})
  .validator(saveIndicadoresDepartamentoSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const departamentos = await db
      .select({
        id: departamentosTable.id,
      })
      .from(departamentosTable)
      .where(eq(departamentosTable.id, data.departamentoId))
      .limit(1);

    if (departamentos.length === 0) {
      throw new Error('Departamento no encontrado');
    }

    const fechaModificacion = new Date();

    const valores = {
      departamentoId: data.departamentoId,

      poblacion2010: data.poblacion2010,
      poblacion2022: data.poblacion2022,

      mujeres2022: data.mujeres2022,
      varones2022: data.varones2022,

      edadMedianaTotal: data.edadMedianaTotal,
      edadMedianaMujeres: data.edadMedianaMujeres,
      edadMedianaVarones: data.edadMedianaVarones,

      poblacionPorEdadSexo: data.poblacionPorEdadSexo,
      ocupacionPorCategoria: data.ocupacionPorCategoria,
      ocupacionPorEdadSexo: data.ocupacionPorEdadSexo,

      fuente: data.fuente,

      observaciones:
        data.observaciones && data.observaciones.length > 0
          ? data.observaciones
          : null,

      fechaModificacion,
    };

    const resultado = await db
      .insert(indicadoresSocialesTable)
      .values(valores)
      .onConflictDoUpdate({
        target: indicadoresSocialesTable.departamentoId,

        set: {
          poblacion2010: valores.poblacion2010,
          poblacion2022: valores.poblacion2022,

          mujeres2022: valores.mujeres2022,
          varones2022: valores.varones2022,

          edadMedianaTotal: valores.edadMedianaTotal,
          edadMedianaMujeres: valores.edadMedianaMujeres,
          edadMedianaVarones: valores.edadMedianaVarones,

          poblacionPorEdadSexo:
            valores.poblacionPorEdadSexo,

          ocupacionPorCategoria:
            valores.ocupacionPorCategoria,

          ocupacionPorEdadSexo:
            valores.ocupacionPorEdadSexo,

          fuente: valores.fuente,
          observaciones: valores.observaciones,
          fechaModificacion,
        },
      })
      .returning();

    if (resultado.length === 0) {
      throw new Error('No se pudieron guardar los indicadores');
    }

    return resultado[0];
  });