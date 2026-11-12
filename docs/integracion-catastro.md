# Integración del Catastro Minero en SIMLaR

Fecha de preparación: 12/11/2026. Responsable de esta etapa: Ana. Base recibida de SIMLaR: commit `9f7871a`, rama `integracion/catastro-minero`.

Origen: Web-Institucional-Minera-La-Rioja, commit de recepción `40bd1abc0945b6a6044c7d36fc60be37375aecb6`. Se conserva la atribución y la relación con la matriz de integración.

## Actualización posterior: panel de ediciones

La etapa más reciente agrega publicación administrativa, tabla de ediciones y actualización del visor desde esas publicaciones. Sus instrucciones actuales, migración, permisos y pruebas están en `panel-catastro.md`. Las secciones siguientes conservan el registro de las etapas iniciales; las referencias a archivos fijos y a no requerir migración corresponden a esas etapas anteriores.

## Actualización: página única Catastro

Por solicitud de Ana, el acceso público se unifica en `/catastro`: primero Catastro Minero, después Catastro Histórico, ambos visibles en la misma página. El menú contiene una sola entrada, Catastro. Hay accesos internos para saltar entre secciones.

`/catastro-minero` redirige a `/catastro#catastro-minero` y `/catastro-historico` a `/catastro#catastro-historico`. La administración sigue en `/catastro-historico/administrar`, con su protección existente. No se cambian consultas, registros, base de datos ni archivos descargables.

Se extrajo el listado histórico a un componente reutilizable. Sus estados de carga, vacío y error quedan dentro de la sección inferior. El enlace de administración usa una dirección absoluta para funcionar desde la página nueva.

Verificaciones de esta actualización: compilación de producción correcta; `/catastro` HTTP 200, orden de secciones confirmado en HTML; ambas direcciones anteriores redirigen a su ancla; GeoJSON/PDF/DWG HTTP 200 y bytes originales. TypeScript no informa errores en archivos de Catastro ni en el menú. La comprobación de registros reales del histórico queda para la computadora de Ana, porque su base de datos no forma parte de esta prueba.

## Qué se recibió y se adaptó

| ID de matriz | Recibido | Incorporación preparada | Validación pendiente |
| --- | --- | --- | --- |
| CAT-01 | Visor Leaflet y mapa base OpenStreetMap | Ruta `/catastro#catastro-minero`, carga solo en navegador y acceso desde Información minera | Revisión visual e interacción en la computadora de Ana |
| CAT-02 | GeoJSON de 2.914 elementos: 1.464 Polygon y 1.450 Point | Copia exacta en `public/catastro-minero/` | Fecha de corte, sistema de referencia, responsable y correspondencia con DWG/PDF |
| CAT-03 | Ficha con nombre, tipo, expediente, titular, departamento y superficie | Se preserva la extracción de datos y se omiten los campos ausentes. El contenido se inserta como texto, no como HTML ejecutable | Cotejar muestras con el área catastral |
| CAT-04 | Selector de parcelas que coinciden en un clic | Se conserva la identificación espacial y la selección. Se ajustó la propagación de eventos en puntos y botones | Probar superposiciones con el archivo real en el navegador |
| CAT-05 | Leyenda de siete categorías | Se conservan categorías y colores del origen. La leyenda es informativa, no un filtro | Validación del área sobre clasificación |
| CAT-06 | Catastro DWG | Copia exacta y descarga desde la página nueva | Abrir en CAD y confirmar edición |
| CAT-07 | Catastro PDF | Copia exacta y descarga desde la página nueva | Revisar contenido, legibilidad y edición |

El total de elementos GeoJSON no equivale al número de derechos mineros distintos: hay puntos y polígonos. No se afirma que esta instantánea sea el catastro vigente. La página muestra que falta confirmar su fecha de corte.

## Decisiones y alcance

- Se adapta el visor y sus algoritmos del repositorio recibido. Los tres archivos geográficos/documentales se copian sin alterar sus bytes. Sus tamaños y SHA-256 figuran en `integracion-catastro.manifest.json`.
- Se mantienen el Catastro Histórico, el visor de proyectos y los cambios de Funciones y competencias. No se cambia la base de datos ni se ejecutan migraciones.
- Se usa Leaflet, ya instalado en SIMLaR. Los textos españoles se extraen del origen a un archivo local. El CSS se adapta sin agregar Sass ni i18next.
- Se conserva el tratamiento de superposiciones, huecos de polígonos y atributos opcionales. Los nombres de puntos se muestran como texto seguro en las ayudas del mapa.
- La navegación nueva se añade al menú común para escritorio y móvil. El árbol de rutas se regeneró con el generador de TanStack del proyecto.
- No se incorpora el resto de la web institucional en este paquete. Las traducciones inglesas del origen quedan fuera del alcance de esta etapa de catastro; su conservación como insumo consta en el inventario de recepción.

## Verificaciones realizadas

- Compilación de producción: `vite build`, completada para cliente y servidor.
- Cinco pruebas del catastro aprobadas: interior/borde/hueco/exterior, superposiciones, atributos opcionales, archivo ausente y formato inválido.
- Página renderizada por servidor: HTTP 200, con descargas y enlace al histórico.
- GeoJSON, PDF y DWG servidos por HTTP 200 y comparados byte por byte con sus archivos originales.
- TypeScript: los archivos del catastro y el menú no reportan errores tras regenerar rutas. La comprobación global conserva errores ajenos a esta incorporación, en modelos de terreno, noticias, institucional y pruebas de usuarios.
- `git diff --check`: sin errores de espacios.
- Revisión visual automatizada: no completada porque el navegador local del entorno no pudo iniciarse. Se requiere la revisión local descrita abajo. No se registra esta etapa como incorporación cerrada ni publicación en producción.

## Comprobación local antes de cerrar la matriz

1. Iniciar SIMLaR y abrir `/catastro` desde Información minera y por URL directa.
2. Comprobar la leyenda y las siete categorías. Seleccionar un polígono y un punto. Cerrar la ficha y volver a seleccionar otra parcela, comprobando que no se pierda el siguiente clic.
3. Seleccionar una zona superpuesta, elegir una candidata y verificar sus atributos. Revisar al menos una muestra con el área responsable.
4. Descargar DWG y PDF, abrirlos en sus aplicaciones y verificar su edición. Comprobar que Catastro Histórico sigue funcionando.
5. Revisar el menú y la página con ancho de celular. Guardar capturas o un video del resultado y registrar commit y evidencia en CAT-01 a CAT-07.

Los archivos y el código están preparados en este paquete. Las validaciones pendientes deben permanecer abiertas en la matriz hasta contar con evidencia.
