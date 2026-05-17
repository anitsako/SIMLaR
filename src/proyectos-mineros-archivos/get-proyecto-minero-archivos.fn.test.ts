import { afterAll, beforeAll, expect, test } from 'vitest';
import { eq, sql } from 'drizzle-orm';
import { getProyectoMineroArchivosFn } from './get-proyecto-minero-archivos.fn';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { proyectosMinerosArchivosTable } from '@/db/schemas/proyectos-mineros-archivos.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

const TEMP_NOMBRE = `tmp-gpa-${String(Date.now()).slice(-7)}`;

let testUserId: number;
let tempTipoId: number;
let tempEtapaId: number;
let tempProyectoId: number;
let tempArchivoMapaId: string;
let tempExtraArchivoId: string;

beforeAll(async () => {
  const usuarios = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(eq(usuariosTable.username, testUsername));

  if (usuarios.length === 0) {
    throw new Error(`Usuario '${testUsername}' no encontrado`);
  }

  const usuario = usuarios[0];
  testUserId = usuario.id;

  const tipos = await db.select({ id: proyectosMinerosTiposTable.id }).from(proyectosMinerosTiposTable);

  if (tipos.length === 0) {
    throw new Error('No se encontró un tipo de proyecto minero');
  }

  const tipo = tipos[0];
  tempTipoId = tipo.id;

  const etapas = await db.select({ id: proyectosMinerosEtapasTable.id }).from(proyectosMinerosEtapasTable);

  if (etapas.length === 0) {
    throw new Error('No se encontró una etapa de proyecto minero');
  }

  const etapa = etapas[0];
  tempEtapaId = etapa.id;

  const [archivoMapa] = await db
    .insert(archivosTable)
    .values({
      nombre: `${TEMP_NOMBRE}.png`,
      tamaño: 100,
      mimeType: 'image/png',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });
  tempArchivoMapaId = archivoMapa.id;

  const [proyecto] = await db
    .insert(proyectosMinerosTable)
    .values({
      nombre: TEMP_NOMBRE,
      tipoId: tempTipoId,
      ubicacion: 'Ubicación temporal',
      provinciaGeologica: 'Provincia temporal',
      area: '100ha',
      litologia: 'Litología temporal',
      mineralizacion: 'Mineralización temporal',
      mineralInteres: 'Cobre',
      modeloGenetico: 'Modelo temporal',
      accesos: 'Accesos temporales',
      etapaId: tempEtapaId,
      propietario: 'Propietario temporal',
      localidadesCercanas: 'Localidad temporal',
      coordenadasGeograficas: sql`ST_SetSRID(ST_MakePoint(-68.5, -30.0), 4326)`,
      msnm: 1500,
      convenioEmse: false,
      archivoMapaId: tempArchivoMapaId,
      visible: true,
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: proyectosMinerosTable.id });
  tempProyectoId = proyecto.id;

  const [extraArchivo] = await db
    .insert(archivosTable)
    .values({
      nombre: `${TEMP_NOMBRE}-extra.pdf`,
      tamaño: 200,
      mimeType: 'application/pdf',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });
  tempExtraArchivoId = extraArchivo.id;

  await db.insert(proyectosMinerosArchivosTable).values({
    proyectoMineroId: tempProyectoId,
    archivoId: tempExtraArchivoId,
    usuarioCreadorId: testUserId,
  });
});

afterAll(async () => {
  await db
    .delete(proyectosMinerosArchivosTable)
    .where(eq(proyectosMinerosArchivosTable.archivoId, tempExtraArchivoId))
    .catch(() => {});
  await db
    .delete(proyectosMinerosTable)
    .where(eq(proyectosMinerosTable.id, tempProyectoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempExtraArchivoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoMapaId))
    .catch(() => {});
});

test('Obtención de archivos de proyecto minero válido devuelve un array', async () => {
  const result = await runTestServerFn(() =>
    getProyectoMineroArchivosFn({ data: { proyectoMineroId: tempProyectoId } })
  );

  expect(Array.isArray(result)).toBe(true);
});

test('Obtención de archivos de proyecto minero devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() =>
    getProyectoMineroArchivosFn({ data: { proyectoMineroId: tempProyectoId } })
  );

  if (result.length > 0) {
    expect(result[0]).toHaveProperty('archivoId');
    expect(result[0]).toHaveProperty('nombre');
    expect(result[0]).toHaveProperty('tamaño');
    expect(result[0]).toHaveProperty('mimeType');
    expect(result[0]).toHaveProperty('fechaCreacion');
  }
});

test('Obtención de archivos de proyecto minero inexistente devuelve array vacío', async () => {
  const result = await runTestServerFn(() => getProyectoMineroArchivosFn({ data: { proyectoMineroId: 999999 } }));

  expect(result).toEqual([]);
});
