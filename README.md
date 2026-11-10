# SIMLaR

**Sistema de Información Minera de La Rioja.** Plataforma web para consultar información minera, territorial e institucional de la provincia a través de un mapa interactivo y un portal de contenidos.

## Qué incluye

- Mapa de proyectos mineros con filtros por tipo y etapa.
- Capas geográficas de departamentos, rutas, cursos de agua, áreas protegidas y servidumbres, entre otras. El selector permite mostrar las capas y descargar los archivos disponibles.
- Secciones de catastro histórico, mapas geológicos, servicios, noticias y formación.
- Pantallas de administración para gestionar proyectos, archivos, usuarios y otros contenidos del portal.

## Tecnologías

| Componente | Herramientas |
| --- | --- |
| Aplicación web | TypeScript, React 19, TanStack Start, Vite y Nitro |
| Interfaz y mapas | HeroUI, Tailwind CSS, Leaflet y React Leaflet |
| Base de datos | PostgreSQL, PostGIS y Drizzle ORM |
| Pruebas | Vitest |

## Puesta en marcha local

La configuración verificada usa **Node.js 24**, **PostgreSQL 18** y **PostGIS 3.6.2**. También necesitás Git y npm.

### 1. Clonar el repositorio e instalar las dependencias

```bash
git clone https://github.com/anitsako/SIMLaR.git
cd SIMLaR
npm ci
```

### 2. Preparar PostgreSQL

En el servidor local, creá un usuario de aplicación llamado `simlar` con contraseña propia y una base de desarrollo llamada `simlar_dev`, con `simlar` como propietario. Conectate a `simlar_dev` con un usuario administrador y habilitá PostGIS:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 3. Configurar el entorno

Creá un archivo `.env` en la raíz del repositorio:

```dotenv
DATABASE_URL="postgresql://simlar:TU_CLAVE_LOCAL@127.0.0.1:5432/simlar_dev"
SESSION_SECRET="REEMPLAZAR_POR_UN_SECRETO_ALEATORIO_LOCAL"
```

Reemplazá los valores de ejemplo. Si la contraseña incluye caracteres reservados en una URL, codificalos antes de incorporarla a `DATABASE_URL`. Para generar el secreto de sesión podés usar `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Mantené `.env` fuera de Git.

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión de la aplicación a PostgreSQL. |
| `SESSION_SECRET` | Secreto para las sesiones de usuario. |
| `FILES_PATH` | Carpeta local para guardar y servir archivos administrados desde el portal. Configurala si vas a usar esas funciones. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO` | Configuración del formulario de contacto. |
| `DATABASE_TEST_URL` | Conexión a una base separada para las pruebas que usan PostgreSQL. |

### 4. Aplicar las migraciones del repositorio

Desde la raíz del proyecto, ejecutá este bloque con `DATABASE_URL` apuntando a la base local de desarrollo. Lee las migraciones versionadas en `drizzle/`, crea el esquema y carga los datos iniciales que vienen con el proyecto.

```bash
node --env-file=.env --input-type=module -e "
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Definí DATABASE_URL en .env');
const url = new URL(connectionString);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
  throw new Error('Usá una base de desarrollo local');
}

const pool = new pg.Pool({ connectionString });
try {
  await migrate(drizzle(pool), { migrationsFolder: './drizzle' });
  console.log('Migraciones aplicadas');
} finally {
  await pool.end();
}
"
```

El comando `npm run db:migrate` usa la configuración de migraciones locales en `drizzle.local/`. Para iniciar una base desde este repositorio, usá el bloque anterior con `drizzle/`.

### 5. Iniciar la aplicación

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000/) y activá **Áreas protegidas** y **Servidumbres** en el selector de capas extras para verificar la conexión y los datos geográficos.

## Organización del repositorio

| Ruta | Contenido |
| --- | --- |
| `src/routes/` | Páginas públicas y rutas de administración. |
| `src/mapa-principal/` | Composición del mapa y sus capas. |
| `src/db/schemas/` | Definiciones del esquema de PostgreSQL. |
| `drizzle/` | Migraciones SQL versionadas y datos iniciales. |
| `public/` | Recursos estáticos y archivos de capas descargables. |
| `scripts/` | Tareas auxiliares de desarrollo y operación. |
| `docs/` | Documentación técnica del proyecto. |

## Comandos habituales

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila la aplicación. |
| `npm run start` | Ejecuta la aplicación compilada. |
| `npm run tests` | Ejecuta las pruebas de Vitest. |

## Documentación y procedencia

- [Instalación y configuración inicial](docs/instalacion.md)
- [Guía de conversión a COG](docs/guia-conversion-cog.md)
- [Publicación de una nueva versión](docs/publicacion-nueva-version.md)

Esta copia conserva el historial de desarrollo de SIMLaR. El [repositorio institucional](https://sim.larioja.gob.ar/git/emse/simlar) es la referencia para las actualizaciones del proyecto.
