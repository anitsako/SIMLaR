import { createServerFn } from "@tanstack/react-start";
import { db } from '../db';
import { catastroHistoricoTable } from "@/db/schemas/catastro-historico";
import { archivosTable } from "@/db/schemas/archivos.schema";
import { eq } from "drizzle-orm";

export type MesCatastro = { id: number, mes: number; archivoId: string, nombre: string }
export type AnioCatastro = { anio: number; meses: MesCatastro[] }

export const getCatastroHistoricoFn = createServerFn({ method: 'GET' }).handler(async (): Promise<AnioCatastro[]> => {
  const filas = await db
    .select({
      id: catastroHistoricoTable.id,
      anio: catastroHistoricoTable.anio,
      mes: catastroHistoricoTable.mes,
      archivoId: catastroHistoricoTable.archivoId,
      nombre: archivosTable.nombre,
    })
    .from(catastroHistoricoTable)
    .innerJoin(archivosTable, eq(catastroHistoricoTable.archivoId, archivosTable.id))
    .orderBy(catastroHistoricoTable.anio, catastroHistoricoTable.mes)

  const mapa = new Map<number, AnioCatastro>()

  for (const fila of filas) {
    if (!mapa.has(fila.anio)) {
      mapa.set(fila.anio, { anio: fila.anio, meses: [] })
    }
    mapa.get(fila.anio)!.meses.push({
      id: fila.id,
      mes: fila.mes,
      archivoId: fila.archivoId,
      nombre: fila.nombre
    })
  }

  return [...mapa.values()]
})
