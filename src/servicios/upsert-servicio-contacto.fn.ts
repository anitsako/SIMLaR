import { createServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { serviciosContactosTable } from '@/db/schemas/servicios-contactos.schema';

const textoOpcional = (maximo: number) =>
  z.string().trim().max(maximo).nullable().optional();

const upsertServicioContactoSchema = z
  .object({
    id: z.number().int().positive().optional(),

    nombre: z.string().trim().min(1).max(150),

    descripcion: z.string().trim().max(2000).default(''),

    tramites: z.string().trim().max(3000).default(''),

    direccion: textoOpcional(250),

    latitud: z.number().min(-90).max(90).nullable().optional(),

    longitud: z.number().min(-180).max(180).nullable().optional(),

    horario: textoOpcional(150),

    telefono: textoOpcional(50),

    whatsapp: textoOpcional(50),

    email: z
      .union([z.string().trim().email().max(150), z.literal(''), z.null()])
      .optional(),

    sitioWeb: textoOpcional(300),

    facebook: textoOpcional(300),

    instagram: textoOpcional(300),

    visible: z.boolean().default(false),

    orden: z.number().int().min(0).max(999).default(0),
  })
  .superRefine((data, context) => {
    const tieneLatitud =
      data.latitud !== undefined && data.latitud !== null;

    const tieneLongitud =
      data.longitud !== undefined && data.longitud !== null;

    if (tieneLatitud !== tieneLongitud) {
      context.addIssue({
        code: 'custom',
        message:
          'La latitud y la longitud deben completarse juntas.',
        path: tieneLatitud ? ['longitud'] : ['latitud'],
      });
    }
  });

const normalizarTexto = (
  valor: string | null | undefined,
): string | null => {
  const texto = valor?.trim();
  return texto ? texto : null;
};

export const upsertServicioContactoFn = createServerFn({
  method: 'POST',
})
  .validator(upsertServicioContactoSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const usuarioId = session.data.usuarioId;

    if (!usuarioId) {
      throw new Error('Usuario no autenticado');
    }

    const valores = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      tramites: data.tramites.trim(),
      direccion: normalizarTexto(data.direccion),
      latitud: data.latitud ?? null,
      longitud: data.longitud ?? null,
      horario: normalizarTexto(data.horario),
      telefono: normalizarTexto(data.telefono),
      whatsapp: normalizarTexto(data.whatsapp),
      email: normalizarTexto(data.email),
      sitioWeb: normalizarTexto(data.sitioWeb),
      facebook: normalizarTexto(data.facebook),
      instagram: normalizarTexto(data.instagram),
      visible: data.visible,
      orden: data.orden,
      usuarioModificadorId: usuarioId,
    };

    if (data.id) {
      const [contactoActualizado] = await db
        .update(serviciosContactosTable)
        .set(valores)
        .where(eq(serviciosContactosTable.id, data.id))
        .returning();

      if (!contactoActualizado) {
        throw new Error('Contacto no encontrado');
      }

      return contactoActualizado;
    }

    const [contactoCreado] = await db
      .insert(serviciosContactosTable)
      .values({
        ...valores,
        usuarioCreadorId: usuarioId,
      })
      .returning();

    return contactoCreado;
  });
