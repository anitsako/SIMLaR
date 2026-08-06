-- Crea tres espacios iniciales ocultos.
-- Un usuario autenticado debe completar los datos y activar
-- "Mostrar este organismo al público" desde la página Servicios.

INSERT INTO servicios_contactos (
  nombre,
  descripcion,
  tramites,
  visible,
  orden
)
SELECT
  'Secretaría de Minería',
  'Organismo provincial competente en materia minera.',
  E'Derechos y solicitudes mineras\nPresentación de documentación\nConsultas sobre expedientes\nCanon y catastro minero',
  false,
  10
WHERE NOT EXISTS (
  SELECT 1
  FROM servicios_contactos
  WHERE nombre = 'Secretaría de Minería'
);

INSERT INTO servicios_contactos (
  nombre,
  descripcion,
  tramites,
  visible,
  orden
)
SELECT
  'Ministerio de Trabajo, Empleo, Industria y Minería',
  'Canal de atención para gestiones vinculadas con empleo, industria, proveedores y minería.',
  E'Registro de proveedores\nConsultas laborales y de empleo\nInformación para empresas del sector',
  false,
  20
WHERE NOT EXISTS (
  SELECT 1
  FROM servicios_contactos
  WHERE nombre = 'Ministerio de Trabajo, Empleo, Industria y Minería'
);

INSERT INTO servicios_contactos (
  nombre,
  descripcion,
  tramites,
  visible,
  orden
)
SELECT
  'Kallpa',
  'Canal institucional para consultas relacionadas con sus actividades y proyectos.',
  E'Consultas institucionales\nInformación sobre proyectos\nProveedores y oportunidades',
  false,
  30
WHERE NOT EXISTS (
  SELECT 1
  FROM servicios_contactos
  WHERE nombre = 'Kallpa'
);
