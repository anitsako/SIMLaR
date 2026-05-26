/**
 * k6 - Prueba de carga de páginas públicas
 *
 * Ejecutar:
 *   k6 run scripts/k6-carga-paginas.js
 *   k6 run --env BASE_URL=http://mi-servidor:3000 scripts/k6-carga-paginas.js
 *
 * Niveles de carga:
 *   - bajo:  1 VU × 30 s  → verificación básica
 *   - medio: rampa hasta 50 VU × 3 min → carga sostenida
 *   - alto:  rampa hasta 150 VU × 5 min → límite de rendimiento
 *
 * Seleccionar nivel con la variable de entorno NIVEL_CARGA:
 *   k6 run --env NIVEL_CARGA=medio scripts/k6-carga-paginas.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const NIVEL_CARGA = __ENV.NIVEL_CARGA || 'bajo';

const errorRate = new Rate('errores');
const pageLoadTime = new Trend('page_load_time', true);

const SCENARIOS = {
  bajo: {
    executor: 'constant-vus',
    vus: 2,
    duration: '30s',
  },
  medio: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 10 },
      { duration: '2m', target: 50 },
      { duration: '30s', target: 0 },
    ],
  },
  alto: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '2m', target: 150 },
      { duration: '1m', target: 0 },
    ],
  },
};

export const options = {
  scenarios: {
    [NIVEL_CARGA]: SCENARIOS[NIVEL_CARGA],
  },
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    http_req_failed: ['rate<0.05'],
    errores: ['rate<0.05'],
  },
};

/** Páginas públicas del sitio */
const RUTAS_PUBLICAS = [
  { ruta: '/', nombre: 'Inicio' },
  { ruta: '/proyectos-mineros', nombre: 'Proyectos Mineros' },
  { ruta: '/mapas-geologicos', nombre: 'Mapas Geológicos' },
  { ruta: '/educacion', nombre: 'Educación' },
  { ruta: '/contacto', nombre: 'Contacto' },
  { ruta: '/institucional', nombre: 'Institucional' },
  { ruta: '/servicios', nombre: 'Servicios' },
  { ruta: '/objetivos', nombre: 'Objetivos' },
  { ruta: '/transparencia', nombre: 'Transparencia' },
];

const HEADERS_COMUNES = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
};

function checkPaginaOk(response, nombre) {
  const ok = check(response, {
    [`${nombre}: status 200`]: (r) => r.status === 200,
    [`${nombre}: tiene contenido HTML`]: (r) => r.body && r.body.length > 100,
    [`${nombre}: tiempo de respuesta < 3s`]: (r) => r.timings.duration < 3000,
  });
  errorRate.add(!ok);
  pageLoadTime.add(response.timings.duration);
}

export default function () {
  // Simula un recorrido de usuario por las páginas principales
  group('Páginas públicas', () => {
    for (const { ruta, nombre } of RUTAS_PUBLICAS) {
      const res = http.get(`${BASE_URL}${ruta}`, {
        headers: HEADERS_COMUNES,
        tags: { pagina: nombre },
      });
      checkPaginaOk(res, nombre);
      sleep(Math.random() * 1 + 0.5); // pausa realista entre páginas
    }
  });

  sleep(1);
}
