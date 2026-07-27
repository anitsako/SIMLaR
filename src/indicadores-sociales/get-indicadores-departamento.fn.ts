import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { indicadoresSocialesTable } from '@/db/schemas/indicadores-sociales.schema';

const getIndicadoresDepartamentoSchema = z.object({
  departamentoId: z.number().int().positive(),
});

export const getIndicadoresDepartamentoFn = createServerFn({
  method: 'GET',
})
  .validator(getIndicadoresDepartamentoSchema)
  .handler(async ({ data }) => {
    const resultado = await db
      .select()
      .from(indicadoresSocialesTable)
      .where(
        eq(
          indicadoresSocialesTable.departamentoId,
          data.departamentoId
        )
      )
      .limit(1);

    if (resultado.length === 0) {
      return null;
    }

    return resultado[0];
  });