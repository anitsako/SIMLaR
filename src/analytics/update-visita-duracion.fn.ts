import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { analyticsVisitas } from '@/db/schemas/analytics-visitas.schema';

export const updateVisitaDuracionFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      visitaId: z.uuid(),
      durationMs: z.number().int().nonnegative(),
      scrollDepthPct: z.number().int().min(0).max(100),
    })
  )
  .handler(async ({ data }) => {
    await db
      .update(analyticsVisitas)
      .set({ durationMs: data.durationMs, scrollDepthPct: data.scrollDepthPct })
      .where(eq(analyticsVisitas.id, data.visitaId));
  });
