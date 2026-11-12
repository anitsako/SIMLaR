# Administración de ediciones del catastro

Preparado el 12/11/2026 sobre SIMLaR `9f7871a` y la integración de la página única `/catastro`.

## Permiso de publicación

En esta versión, publican los usuarios que están activos y tienen el permiso de administrador (`usuarios.es_admin`). El permiso se consulta en la base de datos en cada escritura, además de controlar el acceso a la pantalla. Se aplica la misma comprobación a la carga y eliminación del histórico anterior. Un usuario común no puede publicar, aunque intente llamar directamente a la función del servidor. No se asignan permisos ni se crean usuarios con esta instalación.

## Instalación local

1. Detener `npm run dev` y copiar las carpetas de `cambios` al proyecto.
2. Desde la carpeta SIMLaR ejecutar:

```powershell
node --env-file=.env scripts/migrar-catastro.mjs
```

Este comando usa `DATABASE_URL`, aplica las migraciones pendientes de `drizzle/` y cierra la conexión. Está limitado a una base local. La nueva migración `0044_catastro_ediciones.sql` crea una tabla, sus claves foráneas y una restricción contra duplicados. No reemplaza los datos históricos anteriores. Si la base local tiene migraciones previas pendientes, también las aplicará. Si da error, detenerse y revisar la salida antes de continuar; no borrar tablas ni modificar manualmente el historial de migraciones.

3. Iniciar `npm run dev`, entrar con un usuario administrador y abrir `/catastro` → **Administrar ediciones del catastro**. La dirección directa es `/catastro/administrar`.

En el servidor oficial, el administrador debe aplicar las migraciones mediante el procedimiento de despliegue habitual. El comando local no se conecta a bases remotas.

## Uso

1. Elegir un título e indicar la fecha de corte real de los datos.
2. Adjuntar el GeoJSON de la edición. Es obligatorio. PDF y DWG son opcionales, con un límite de 20 MB por archivo.
3. Agregar observaciones. Pulsar **Revisar edición** y comprobar la vista previa del mapa y la cantidad de elementos.
4. Revisar técnicamente los datos. Pulsar **Publicar edición y guardar en histórico**.

La publicación crea una nueva edición, guarda sus archivos en `FILES_PATH`, registra responsable y fecha de publicación y la convierte en la que utiliza el visor. La anterior conserva sus archivos en el Catastro Histórico. Se permiten varias ediciones de un mismo mes y una misma fecha de corte. Se rechaza una repetición con los mismos archivos y fecha de corte.

Si el PDF o DWG no se adjunta, no se reutiliza el de otra edición como si correspondiera a los nuevos datos. Esa descarga no aparece en el visor actual, pero los archivos anteriores siguen accesibles en el histórico.

El panel no convierte DWG a GeoJSON ni detecta cambios en una computadora ajena. El área prepara los archivos y los publica desde SIMLaR. Si solo cambia un documento, puede adjuntar el mismo GeoJSON junto con el documento nuevo, dejando registrada otra edición.

## Visor e histórico

- `/catastro` sigue siendo la única página pública, con el visor primero y el histórico después.
- El visor consulta la última edición al entrar, al recuperar el foco y cada 60 segundos mientras la página está activa. Tras publicar desde el panel se invalida la caché de ediciones.
- Antes de la primera publicación se muestran los archivos originales de la recepción, cuya fecha de corte sigue sin confirmar. Estos archivos permanecen también como una entrada de referencia en el histórico.
- Las ediciones publicadas aparecen debajo del visor con fecha de corte, fecha de publicación y sus descargas. Luego se muestran los archivos históricos anteriores, organizados por año y mes, sin trasladarlos ni borrarlos.
- La administración antigua sigue en `/catastro-historico/administrar`, limitada ahora a administradores activos.
- Un error al consultar las ediciones se informa al usuario. No se muestra silenciosamente la recepción inicial como si fuera la edición más reciente.

## Integridad y conservación

Se valida formato, geometrías soportadas, coordenadas finitas en grados, anillos cerrados, fechas reales, tamaños y cabeceras PDF/DWG. Estas comprobaciones no garantizan exactitud catastral ni equivalencia entre formatos: el responsable debe revisar el mapa y los documentos antes de publicar.

La escritura usa identificadores aleatorios para los archivos y nombres de descarga generados por el servidor. Las publicaciones se serializan con un bloqueo transaccional. Una transacción inserta la metadata de archivos y la edición; si falla, no cambia la edición actual y se eliminan los archivos nuevos escritos durante el intento. Los archivos referenciados por una edición tienen claves foráneas que impiden eliminarlos desde otro módulo sin resolver antes sus referencias.

No hay función de eliminación de ediciones publicadas. Para corregir datos se publica una nueva edición. Se debe respaldar tanto PostgreSQL como el directorio persistente `FILES_PATH`: la base guarda la metadata, no los bytes de los documentos.

## Correspondencia con la matriz

CAT-01 y CAT-02: el visor pasa de una ruta fija a la última edición publicada. CAT-03 a CAT-05: se conservan fichas, identificación y leyenda, también disponibles en la vista previa. CAT-06 y CAT-07: las descargas corresponden a la edición seleccionada. La carga y conservación automática agrega una capacidad que el repositorio de origen no incluía.

El código está preparado. El cierre de la matriz requiere probar el panel con el usuario local, publicar una edición de prueba validada y guardar la evidencia del resultado.

## Verificación realizada

- Compilación de producción del cliente y servidor completada.
- 14 pruebas unitarias y de geometría aprobadas, incluida la recepción completa de 2.914 elementos.
- 7 pruebas de publicación con motor SQL PostgreSQL embebido PGlite, archivos reales en un directorio temporal y sesión controlada: anónimo, usuario común y administrador inactivo rechazados; publicación con tres archivos; dos ediciones de un mismo mes; rechazo de duplicados; limpieza tras error SQL; rechazo de PDF inválido. La migración 0044 se ejecutó sobre tablas de prueba de usuarios y archivos.
- No se ejecutó ninguna migración en la computadora del usuario ni en el servidor oficial.
- TypeScript no informa errores en los archivos de Catastro; el proyecto conserva errores globales previos en otros módulos.
- No se completó una revisión visual automatizada del navegador por las restricciones del entorno. Hace falta comprobar el formulario y la vista previa en la computadora del usuario.
