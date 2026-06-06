# Instalación y configuración inicial

## Requisitos previos

- Node.js (v20 o superior)
- PostgreSQL (v16 o superior)
- Extensión PostGIS instalada en PostgreSQL

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd simlar
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/simlar
```

Reemplazar `usuario`, `contraseña` y `simlar` con las credenciales y nombre de tu
base de datos PostgreSQL. Modificar `localhost` o `5432` si tu base de datos está
en otro servidor o puerto.

### 4. Habilitar PostGIS (hacer esto con cada nueva base de datos)

```sql
CREATE EXTENSION postgis;
```

### 5. Aplicar migraciones

Para aplicar las migraciones a la base de datos:

```bash
npm run db:migrate
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`.

## Tecnologías principales

- **Frontend:** React 19, TanStack Router, TanStack Query
- **Backend:** TanStack Start (Nitro)
- **Base de datos:** PostgreSQL con PostGIS
- **ORM:** Drizzle ORM
- **Mapas:** Leaflet, React Leaflet
- **UI:** HeroUI, Tailwind CSS
- **Animaciones:** Framer Motion
