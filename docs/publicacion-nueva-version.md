# Publicación de una nueva versión

Esta guía describe cómo versionar, construir, publicar y desplegar una nueva
versión de SIMLaR mediante Docker.

## Requisitos

- Tener acceso al repositorio y estar ubicado en su raíz.
- Tener Docker instalado y autenticado en el registro de imágenes.
- Tener acceso SSH al servidor de producción.
- Conocer la ruta del archivo `docker-compose.yml` en el servidor.

La imagen se publica con el siguiente nombre:

```text
sim.larioja.gob.ar/emse/simlar:<versión>
```

La versión utilizada en la etiqueta de Docker se obtiene automáticamente de
`package.json`.

## 1. Actualizar la versión

Verificar la versión actual:

```bash
npm pkg get version
```

Elegir **una** de las siguientes opciones:

### Nueva versión minor

Usar para agregar funcionalidad compatible con la versión actual:

```bash
npm version minor
```

Por ejemplo, `0.16.0` pasa a `0.17.0`.

### Nueva versión major

Usar para cambios incompatibles con versiones anteriores:

```bash
npm version major
```

Por ejemplo, `0.16.0` pasa a `1.0.0`.

`npm version` actualiza `package.json` y `package-lock.json`, y crea un tag de
Git para la nueva versión.

## 2. Construir la imagen Docker

Desde la raíz del proyecto, ejecutar:

```bash
npm run docker:build:prod
```

El script construye la imagen con la versión indicada en `package.json`:

```text
sim.larioja.gob.ar/emse/simlar:<versión>
```

Confirmar la etiqueta generada:

```bash
docker image ls sim.larioja.gob.ar/emse/simlar
```

## 3. Subir la imagen al registro

Si todavía no se inició sesión en el registro, hacerlo según las credenciales
proporcionadas por el administrador:

```bash
docker login sim.larioja.gob.ar
```

Subir la imagen:

```bash
npm run docker:push:prod
```

El script publica automáticamente la versión actual de `package.json`.

## 4. Conectarse al servidor por SSH

Reemplazar los valores de ejemplo por los correspondientes al entorno:

```bash
ssh <usuario>@<servidor>
```

Ir al directorio donde se encuentra el archivo Compose:

```bash
cd <ruta-del-proyecto-en-el-servidor>
```

## 5. Actualizar la versión en Docker Compose

Editar el archivo Compose:

```bash
nano docker-compose.yml
```

Modificar la propiedad `image` del servicio de SIMLaR para que use la nueva
versión:

```yaml
services:
  simlar_app:
    image: sim.larioja.gob.ar/emse/simlar:<nueva-versión>
```

Por ejemplo:

```yaml
services:
  simlar_app:
    image: sim.larioja.gob.ar/emse/simlar:0.17.0
```

Conservar el resto de la configuración del servicio. Si el archivo tiene otro
nombre, como `compose.yml`, usar ese nombre en los comandos siguientes.

## 6. Descargar la nueva imagen

Desde el mismo directorio del archivo Compose:

```bash
docker compose pull simlar_app
```

## 7. Levantar el contenedor con la nueva imagen

Recrear el contenedor usando la imagen actualizada:

```bash
docker compose up -d simlar_app
```

Para levantar o recrear todos los servicios (opcional):

```bash
docker compose up -d
```

## 8. Verificar el despliegue (opcionales)

Comprobar que el contenedor esté ejecutándose:

```bash
docker compose ps
```

Revisar los logs del servicio:

```bash
docker compose logs --tail=100 -f simlar_app
```

Validar también la aplicación desde su URL habitual y confirmar que responde
correctamente.

## Resumen de comandos

En la máquina de desarrollo:

```bash
# Elegir solo una opción: minor o major
npm version minor
# npm version major

npm run docker:build:prod
npm run docker:push:prod
```

En el servidor:

```bash
ssh <usuario>@<servidor>
cd <ruta-del-proyecto-en-el-servidor>

# Editar docker-compose.yml y cambiar la etiqueta a <nueva-versión>
docker compose pull simlar_app
docker compose up -d simlar_app

# Opcionales
docker compose ps
docker compose logs --tail=100 simlar_app
```
