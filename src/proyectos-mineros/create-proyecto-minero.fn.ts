import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';

const createProyectoMineroSchema = z.object({
  nombre: z.string().min(1).max(100),
  tipoId: z.number().int().positive(),
  ubicacion: z.string().min(1).max(100),
  provinciaGeologica: z.string().min(1).max(100),
  area: z.string().min(1).max(10),
  litologia: z.string().min(1),
  mineralizacion: z.string().min(1),
  mineralInteres: z.string().min(1).max(100),
  modeloGenetico: z.string().min(1),
  accesos: z.string().min(1),
  etapa: z.string().min(1).max(100),
  propietario: z.string().min(1).max(100),
  localidadesCercanas: z.string().min(1).max(100),
  coordenadasGeograficas: z.object({ lat: z.number(), lng: z.number() }),
  msnm: z.number().int(),
  convenioEmse: z.boolean(),
  visible: z.boolean().default(true),
});

export const createProyectoMineroFn = createServerFn({ method: 'POST' })
  .inputValidator(createProyectoMineroSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const [proyectoMinero] = await db
      .insert(proyectosMinerosTable)
      .values({
        ...data,
        coordenadasGeograficas: sql`ST_SetSRID(ST_MakePoint(${data.coordenadasGeograficas.lng}, ${data.coordenadasGeograficas.lat}), 4326)`,
        usuarioCreadorId: usuarioId,
        usuarioModificadorId: usuarioId,
      })
      .returning();

    return proyectoMinero;
  });
