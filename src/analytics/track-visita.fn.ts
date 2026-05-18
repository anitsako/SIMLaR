import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '@/db';
import { analyticsVisitas } from '@/db/schemas/analytics-visitas.schema';

export const trackVisitaFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      sessionId: z.uuid(),
      pathname: z.string().max(1024),
      title: z.string().max(1024).nullable(),
    })
  )
  .handler(async ({ data }) => {
    const [visita] = await db
      .insert(analyticsVisitas)
      .values({
        sessionId: data.sessionId,
        pathname: data.pathname,
        title: data.title,
      })
      .returning({ id: analyticsVisitas.id });

    return { visitaId: visita.id };
  });
