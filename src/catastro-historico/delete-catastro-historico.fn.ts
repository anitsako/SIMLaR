import { requireCatastroAdmin } from '@/catastro-minero/permisos.server';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { createServerFn } from "@tanstack/react-start";
import z from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { catastroHistoricoTable } from "@/db/schemas/catastro-historico";
import { archivosTable } from "@/db/schemas/archivos.schema";


export const deleteCatastroHistoricoFn = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {

    await requireCatastroAdmin();

    const filesPath = process.env.FILES_PATH
    if (!filesPath) throw new Error('FILES_PATH no está definida')

    const archivoId = await db.transaction(async (tx) => {
      const [registro] = await tx
        .select({ archivoId: catastroHistoricoTable.archivoId })
        .from(catastroHistoricoTable)
        .where(eq(catastroHistoricoTable.id, data.id))

      if (!registro?.archivoId) throw new Error('El registro no existe')

      await tx
        .delete(catastroHistoricoTable)
        .where(eq(catastroHistoricoTable.id, data.id))

      await tx
        .delete(archivosTable)
        .where(eq(archivosTable.id, registro.archivoId))

      return registro.archivoId
    })

    try {
      await unlink(path.join(filesPath, archivoId))
    } catch {
    }

    return { ok: true }
  })
