import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { proyectosMinerosTable } from '../db/schemas/proyectos-mineros.schema';

export const getProyectosMinerosCountFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      visible: z.boolean().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { visible } = data;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(proyectosMinerosTable)
      .where(
        eq(proyectosMinerosTable.visible, visible!).if(visible !== undefined)
      )
      return result[0].count
  });
