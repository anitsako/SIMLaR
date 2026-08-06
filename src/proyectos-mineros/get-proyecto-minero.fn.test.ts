import { afterAll, beforeAll, expect, test } from 'vitest';
import { eq, sql } from 'drizzle-orm';
import { getProyectoMineroFn } from './get-proyecto-minero.fn';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

const TEMP_NOMBRE = `tmp-gpm-${String(Date.now()).slice(-7)}`;

let testUserId: number;
let tempTipoId: number;
let tempEtapaId: number;
let tempProyectoId: number;
let tempArchivoMapaId: string;

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
      area: '100',
      areaHectareas: 100,
      litologia: 'Litología temporal',
      mineralizacion: 'Mineralización temporal',
      mineralInteres: 'Oro',
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
});

afterAll(async () => {
  await db
    .delete(proyectosMinerosTable)
    .where(eq(proyectosMinerosTable.id, tempProyectoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoMapaId))
    .catch(() => {});
});

test('Obtención de proyecto minero con ID válido devuelve el proyecto', async () => {
  const result = await runTestServerFn(() => getProyectoMineroFn({ data: { id: tempProyectoId } }));

  expect(result).not.toBeNull();
  expect(result.id).toBe(tempProyectoId);
  expect(result.nombre).toBe(TEMP_NOMBRE);
  expect(result).toHaveProperty('provinciaGeologica');
  expect(result.areaHectareas).toBe(100);
  expect(result).toHaveProperty('archivoMapa');
  expect(result.archivoMapa.id).toBe(tempArchivoMapaId);
});

test('Obtención de proyecto minero devuelve el objeto tipo anidado esperado', async () => {
  const result = await runTestServerFn(() => getProyectoMineroFn({ data: { id: tempProyectoId } }));

  expect(result).not.toBeNull();
  expect(result.tipo).toMatchObject({ id: tempTipoId });
  expect(result.tipo).toHaveProperty('nombre');
  expect(result.tipo).toHaveProperty('forma');
});

test('Obtención de proyecto minero inexistente devuelve null', async () => {
  const result = await runTestServerFn(() => getProyectoMineroFn({ data: { id: 999999 } }));

  expect(result).toBeNull();
});
