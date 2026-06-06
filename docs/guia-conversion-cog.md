# Guía: Preparar modelos de terreno para SIMLaR

Esta guía explica cómo convertir los archivos generados por WebODM al formato que
necesita el sistema (COG en Web Mercator), para poder cargarlos en un proyecto minero.

El sistema **no** convierte los archivos automáticamente: hay que prepararlos antes con
las herramientas de GDAL siguiendo estos pasos.

---

## Índice

1. [Qué archivos necesitás y de dónde salen (WebODM)](#1-qué-archivos-necesitás-y-de-dónde-salen-webodm)
2. [Instalar GDAL (OSGeo4W, Windows)](#2-instalar-gdal-osgeo4w-windows)
3. [Preparar la terminal antes de convertir](#3-preparar-la-terminal-antes-de-convertir)
4. [Convertir la ortofoto a COG](#4-convertir-la-ortofoto-a-cog)
5. [Convertir el MDT a COG](#5-convertir-el-mdt-a-cog)
6. [Generar el MDT coloreado](#6-generar-el-mdt-coloreado)
7. [Verificar que los archivos quedaron bien](#7-verificar-que-los-archivos-quedaron-bien)
8. [Resumen rápido de archivos finales](#8-resumen-rápido-de-archivos-finales)

---

## 1. Qué archivos necesitás y de dónde salen (WebODM)

Después de procesar las fotos del dron en **WebODM**, en la pestaña de descargas del
proyecto vas a encontrar varios archivos. Los que nos interesan son dos:

| Archivo de WebODM | Qué es | Para qué lo usamos |
|---|---|---|
| `odm_orthophoto.tif` | La **ortofoto**: la foto aérea cosida y georreferenciada (imagen real del terreno) | Capa de imagen real en el mapa |
| `dsm.tif` o `dtm.tif` | El **MDT**: el modelo de elevación (cada píxel guarda la altura en metros, no un color) | Capa de elevación + versión coloreada |

> **Nota sobre DSM vs DTM:** el DSM incluye todo lo que sobresale (edificios, árboles).
> El DTM es solo el suelo. Para visualización general cualquiera sirve; usá el que
> WebODM te haya generado.

A partir de **estos dos archivos** vamos a generar **tres archivos COG**:

- La ortofoto en COG
- El MDT en COG
- El MDT coloreado en COG (se genera a partir del MDT)

---

## 2. Instalar GDAL (OSGeo4W, Windows)

GDAL es el conjunto de herramientas que hace las conversiones. En Windows se instala
de forma sencilla a través de **OSGeo4W**.

1. Entrá a la página oficial: **https://trac.osgeo.org/osgeo4w/**
2. Descargá el instalador (**OSGeo4W Network Installer**, versión 64-bit).
3. Ejecutalo y elegí la instalación **Express Install**.
4. En la lista de paquetes, asegurate de que **GDAL** esté tildado (suele venir por defecto).
5. Completá la instalación.

### Verificar la instalación

OSGeo4W instala GDAL pero **no lo agrega al PATH global de Windows**. Por eso, los
comandos de GDAL funcionan desde su propia consola:

1. Abrí el menú de inicio y buscá **"OSGeo4W Shell"**.
2. En esa consola, escribí:

   ```bash
   gdalinfo --version
   ```

3. Si responde algo como `GDAL 3.x.x, released ...`, está instalado correctamente.

> **Importante:** todos los comandos de esta guía se ejecutan desde la **OSGeo4W Shell**,
> no desde la consola común de Windows (CMD/PowerShell).

---

## 3. Preparar la terminal antes de convertir

### 3.1. Ir a la carpeta con los archivos

Usá `cd` para ubicarte en la carpeta donde descargaste los archivos de WebODM. Por ejemplo:

```bash
cd C:\Users\TuUsuario\Desktop\proyecto-dron
```

### 3.2. Evitar el error de PROJ (importante si tenés PostgreSQL)

Si en tu máquina hay **PostgreSQL/PostGIS** instalado, GDAL puede tomar una base de
datos de coordenadas vieja y fallar con un error como:

```
ERROR 1: PROJ: proj_create_from_database: ... proj.db contains DATABASE.LAYOUT.VERSION.MINOR = 2 ...
```

Para evitarlo, antes de correr los comandos ejecutá esta línea en la misma consola
(ajustá la ruta si instalaste OSGeo4W en otro lado):

```bash
set PROJ_LIB=C:\OSGeo4W\share\proj
```

> Esto le indica a GDAL qué base de datos de coordenadas usar. Solo aplica a esa sesión
> de la consola; si cerrás y reabrís la terminal, hay que volver a ejecutarla.

### 3.3. Nombres de archivo sin espacios

Para evitar problemas, conviene que los archivos **no tengan espacios** en el nombre.
Si los tienen, renombralos (por ejemplo `mi orto.tif` → `orto.tif`) o escribí el nombre
entre comillas en los comandos.

---

## 4. Convertir la ortofoto a COG

La ortofoto es una imagen RGB. Hacemos dos pasos: reproyectar a Web Mercator y luego
convertir a COG.

```bash
gdalwarp -t_srs EPSG:3857 -dstalpha -srcnodata "0 0 0" odm_orthophoto.tif ortofoto-3857.tif

gdal_translate ortofoto-3857.tif ortofoto-cog.tif -of COG -co COMPRESS=WEBP -co QUALITY=85 -co BLOCKSIZE=512 -co OVERVIEW_COUNT=8
```

### Qué hace cada parte

**Primer comando (`gdalwarp` — reproyecta):**

- `-t_srs EPSG:3857` → reproyecta al sistema **Web Mercator**, que es el que usan los
  mapas web. Es obligatorio para que la imagen se alinee con el mapa del sistema.
- `-dstalpha` → agrega un canal de **transparencia**. Esto hace que las zonas sin datos
  (los bordes negros que deja el dron) queden transparentes en vez de negras.
- `-srcnodata "0 0 0"` → indica que el color negro (0,0,0) representa "sin datos", para
  que esas zonas se vuelvan transparentes.
- `odm_orthophoto.tif` → archivo de entrada (el de WebODM).
- `ortofoto-3857.tif` → archivo intermedio de salida (reproyectado).

**Segundo comando (`gdal_translate` — convierte a COG):**

- `-of COG` → formato de salida **Cloud Optimized GeoTIFF**, el que el sistema necesita.
- `-co COMPRESS=WEBP` → compresión WEBP (buena calidad, peso reducido, **soporta
  transparencia**, a diferencia de JPEG).
- `-co QUALITY=85` → calidad de compresión (85 es un buen equilibrio peso/calidad).
- `-co BLOCKSIZE=512` → tamaño de los bloques internos (los "pedacitos" que el mapa pide
  según el zoom). 512 es un valor estándar y eficiente.
- `-co OVERVIEW_COUNT=8` → genera **8 versiones reducidas** de la imagen para los
  distintos niveles de zoom. Sin esto, el mapa se ve mal al alejarse.

Podés borrar el archivo intermedio cuando termines:

```bash
del ortofoto-3857.tif
```

El archivo final para subir al sistema es **`ortofoto-cog.tif`**.

---

## 5. Convertir el MDT a COG

El MDT es un archivo de elevación (no una imagen de colores). También se reproyecta y
se convierte a COG, pero con compresión sin pérdida para no alterar los valores de altura.

```bash
gdalwarp -t_srs EPSG:3857 dtm.tif mdt-3857.tif

gdal_translate mdt-3857.tif mdt-cog.tif -of COG -co COMPRESS=DEFLATE -co BLOCKSIZE=512 -co OVERVIEW_COUNT=8
```

> Si tu archivo se llama `dsm.tif` en vez de `dtm.tif`, usá ese nombre en el primer comando.

### Qué hace cada parte

**Primer comando (`gdalwarp`):**

- `-t_srs EPSG:3857` → reproyecta a Web Mercator (igual que la ortofoto).
- (Acá **no** usamos `-dstalpha` ni `-srcnodata`; el MDT maneja sus zonas vacías con su
  propio valor de "nodata", que GDAL respeta automáticamente.)

**Segundo comando (`gdal_translate`):**

- `-of COG` → formato Cloud Optimized GeoTIFF.
- `-co COMPRESS=DEFLATE` → compresión **sin pérdida**. Importante: el MDT guarda alturas
  reales en metros, así que no se puede usar compresión con pérdida (como JPEG/WEBP) que
  alteraría los valores.
- `-co BLOCKSIZE=512` y `-co OVERVIEW_COUNT=8` → igual que en la ortofoto.

Borrá el intermedio si querés:

```bash
del mdt-3857.tif
```

El archivo final es **`mdt-cog.tif`**.

---

## 6. Generar el MDT coloreado

El MDT coloreado es una versión del MDT donde cada altura se pinta con un color (de
zonas bajas a zonas altas). Esto es lo que se ve como "mapa de calor de elevación"
sobre el terreno.

### 6.1. Conocer el rango de alturas del MDT

Primero necesitás saber entre qué alturas está tu terreno. Ejecutá:

```bash
gdalinfo -mm mdt-cog.tif
```

Buscá en la salida una línea parecida a:

```
Computed Min/Max=268.160,405.710
```

Esos son la **altura mínima y máxima** en metros. Anotalos (en el ejemplo: 268 y 405).

### 6.2. Crear el archivo de paleta de colores

Creá un archivo de texto llamado **`color-ramp.txt`** en la misma carpeta. Podés hacerlo
con el Bloc de notas. El contenido define qué color corresponde a cada altura, usando la
paleta **viridis** (la misma que usa WebODM, fácil de leer):

```
268 68 1 84 255
283 71 44 122 255
298 59 81 139 255
313 44 113 142 255
328 33 144 141 255
343 39 173 129 255
358 92 200 99 255
373 170 220 50 255
388 253 231 37 255
405 253 231 37 255
nv 0 0 0 0
```

> **Cada línea es:** `altura R G B A` (los valores de color van de 0 a 255).
> La última línea `nv 0 0 0 0` define que las zonas sin datos quedan transparentes.

**Importante:** la **primera** altura (268) debe coincidir con tu mínimo real, y la
**última** (405) con tu máximo real. Si tu terreno tiene otro rango (por ejemplo
245 a 380), ajustá esos números repartiendo los intermedios de forma proporcional.

### 6.3. Generar el coloreado y convertirlo a COG

```bash
gdaldem color-relief mdt-cog.tif color-ramp.txt mdt-coloreado.tif -alpha

gdal_translate mdt-coloreado.tif mdt-coloreado-cog.tif -of COG -co COMPRESS=DEFLATE -co BLOCKSIZE=512 -co OVERVIEW_COUNT=8
```

### Qué hace cada parte

**Primer comando (`gdaldem color-relief` — colorea):**

- `mdt-cog.tif` → el MDT de entrada (el que ya convertiste).
- `color-ramp.txt` → el archivo de paleta que creaste.
- `mdt-coloreado.tif` → salida coloreada (intermedia).
- `-alpha` → agrega transparencia en las zonas sin datos.

**Segundo comando (`gdal_translate`):**

- Convierte el coloreado a COG, igual que los anteriores. Como ya es una imagen de
  colores (RGBA), se trata como la ortofoto.

Borrá el intermedio:

```bash
del mdt-coloreado.tif
```

El archivo final es **`mdt-coloreado-cog.tif`**.

---

## 7. Verificar que los archivos quedaron bien

Para confirmar que un archivo es un COG válido y está en el sistema correcto, ejecutá:

```bash
gdalinfo mdt-cog.tif
```

Fijate en la salida que:

- Aparezca **`LAYOUT=COG`** (confirma que es un Cloud Optimized GeoTIFF).
- En `Coordinate System` diga **`WGS 84 / Pseudo-Mercator`** o **`EPSG:3857`**
  (confirma que está en Web Mercator).
- Aparezca una línea de **`Overviews:`** con varias versiones reducidas.

Repetí la verificación con los tres archivos finales.

---

## 8. Resumen rápido de archivos finales

Al terminar, tenés que tener estos tres archivos listos para subir al crear o modificar
un proyecto minero:

| Archivo final | Origen | Compresión |
|---|---|---|
| `ortofoto-cog.tif` | `odm_orthophoto.tif` de WebODM | WEBP (con transparencia) |
| `mdt-cog.tif` | `dtm.tif` / `dsm.tif` de WebODM | DEFLATE (sin pérdida) |
| `mdt-coloreado-cog.tif` | generado a partir de `mdt-cog.tif` | DEFLATE |

En el formulario del sistema, cada uno va en su campo correspondiente:

- **MDT (COG GeoTIFF)** → `mdt-cog.tif`
- **Ortofoto (COG GeoTIFF)** → `ortofoto-cog.tif`
- **MDT Coloreado (COG GeoTIFF)** → `mdt-coloreado-cog.tif`

> Los tres son opcionales: podés subir solo los que tengas. Si más adelante generás
> alguno que falta, podés agregarlo desde la opción de **modificar** el proyecto.

---

### Recordatorio de problemas comunes

- **`gdalinfo` no se reconoce** → no estás en la OSGeo4W Shell. Abrila desde el menú de inicio.
- **Error de PROJ / proj.db** → ejecutá `set PROJ_LIB=C:\OSGeo4W\share\proj` antes de los comandos.
- **El nombre del archivo tiene espacios** → renombralo o escribilo entre comillas.
- **El coloreado se ve todo de un color** → revisá que el rango (primera y última altura)
  de `color-ramp.txt` coincida con el `Min/Max` real del MDT.
