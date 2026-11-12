import { desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { catastroEdicionesTable } from '@/db/schemas/catastro-ediciones.schema';
import { requireCatastroAdmin } from './permisos.server';
import { MAX_ARCHIVO, validarFecha, validarGeojson } from './validar-edicion';

const archivo = z.object({ base64: z.string().min(1).max(Math.ceil(MAX_ARCHIVO / 3) * 4) });
export const publicarSchema = z.object({
  titulo: z.string().trim().min(3).max(120), fechaCorte: z.string(),
  observaciones: z.string().trim().max(2000), geojson: archivo,
  pdf: archivo.optional(), dwg: archivo.optional(),
});

export const listarEdicionesCatastro = async () =>
  db.select({
    id: catastroEdicionesTable.id, titulo: catastroEdicionesTable.titulo,
    fechaCorte: catastroEdicionesTable.fechaCorte, observaciones: catastroEdicionesTable.observaciones,
    publicadaEn: catastroEdicionesTable.publicadaEn, elementos: catastroEdicionesTable.elementos,
    geojsonId: catastroEdicionesTable.geojsonId, pdfId: catastroEdicionesTable.pdfId, dwgId: catastroEdicionesTable.dwgId,
  }).from(catastroEdicionesTable).orderBy(desc(catastroEdicionesTable.id));

export async function publicarEdicionCatastro({ data }: { data: z.infer<typeof publicarSchema> }) {
    const usuarioId = await requireCatastroAdmin();
    validarFecha(data.fechaCorte);
    const entries: { id: string; ext: string; mime: string; bytes: Buffer }[] = [];
    for (const [ext, mime] of [['geojson','application/geo+json'],['pdf','application/pdf'],['dwg','image/vnd.dwg']] as const) {
      const file = data[ext]; if (!file) continue;
      if (file.base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.base64)) throw new Error('Contenido de archivo inválido.');
      const bytes = Buffer.from(file.base64, 'base64');
      if (!bytes.length || bytes.length > MAX_ARCHIVO) throw new Error('Cada archivo debe tener entre 1 byte y 20 MB.');
      if (ext === 'pdf' && bytes.subarray(0,5).toString() !== '%PDF-') throw new Error('El archivo PDF no tiene un formato válido.');
      if (ext === 'dwg' && !/^AC10\d{2}$/.test(bytes.subarray(0,6).toString())) throw new Error('El archivo DWG no tiene una cabecera reconocida.');
      entries.push({id: randomUUID(), ext, mime, bytes});
    }
    const geo = entries.find(x => x.ext === 'geojson')!;
    let parsed: unknown;
    try { parsed = JSON.parse(geo.bytes.toString('utf8')); } catch { throw new Error('El GeoJSON no es un JSON válido.'); }
    const elementos = validarGeojson(parsed);
    const firma = createHash('sha256').update(JSON.stringify([data.fechaCorte, ...entries.map(x => [x.ext,createHash('sha256').update(x.bytes).digest('hex')])])).digest('hex');
    const filesPath = process.env.FILES_PATH;
    if (!filesPath) throw new Error('FILES_PATH no está configurada.');
    await mkdir(filesPath, {recursive:true});
    const written: string[] = [];
    try {
      for (const e of entries) { const p = path.join(filesPath,e.id); await writeFile(p,e.bytes,{flag:'wx'}); written.push(p); }
      return await db.transaction(async tx => {
        // Serializa publicaciones: el mayor id siempre corresponde a la última publicación completada.
        await tx.execute(sql`select pg_advisory_xact_lock(73519120)`);
        const [prev] = await tx.select({id:catastroEdicionesTable.id}).from(catastroEdicionesTable).where(sql`${catastroEdicionesTable.firma} = ${firma}`);
        if (prev) throw new Error('Esta edición y estos archivos ya fueron publicados.');
        await tx.insert(archivosTable).values(entries.map(e => ({
          id:e.id, nombre:`catastro-${data.fechaCorte}.${e.ext}`, tamaño:e.bytes.length, mimeType:e.mime,
          usuarioCreadorId:usuarioId, usuarioModificadorId:usuarioId,
        })));
        const [edition] = await tx.insert(catastroEdicionesTable).values({
          titulo:data.titulo,fechaCorte:data.fechaCorte,observaciones:data.observaciones,usuarioId,elementos,firma,
          geojsonId:geo.id,pdfId:entries.find(x=>x.ext==='pdf')?.id,dwgId:entries.find(x=>x.ext==='dwg')?.id,
        }).returning({id:catastroEdicionesTable.id});
        return edition;
      });
    } catch (error) {
      await Promise.all(written.map(p=>unlink(p).catch(()=>{})));
      throw error;
    }
}
