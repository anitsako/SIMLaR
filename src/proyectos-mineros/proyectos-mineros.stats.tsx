import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Spinner,
} from '@heroui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  ChartColumnIncreasing,
  MapPinned,
  MousePointerClick,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useProyectosMinerosStats } from './use-proyectos-mineros-stats';

interface DistribucionItem {
  id?: number;
  nombre: string;
  cantidad: number;
  color?: string;
  esAgrupado?: boolean;
}

interface DistribucionGraficoItem extends DistribucionItem {
  porcentaje: number;
  etiqueta: string;
}

interface GraficoDistribucionProps {
  titulo: string;
  descripcion: string;
  datos: Array<DistribucionItem>;
  total: number;
  colorBase: string;
  usarColorDato?: boolean;
  onSeleccionar?: (item: DistribucionItem) => void;
  estaSeleccionado?: (item: DistribucionItem) => boolean;
}

const formatearEntero = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 0,
});

const formatearHectareas = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatearPorcentaje = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const coloresTipo = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

function calcularPorcentaje(cantidad: number, total: number) {
  return total > 0 ? (cantidad / total) * 100 : 0;
}

function normalizarColorEtapa(color?: string) {
  if (!color) {
    return '#64748b';
  }

  const colores: Record<string, string> = {
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    yellow: '#ca8a04',
    orange: '#ea580c',
    purple: '#9333ea',
    gray: '#64748b',
    grey: '#64748b',
  };

  return colores[color.toLowerCase()] ?? color;
}

function abreviarEtiqueta(valor: unknown) {
  const texto = String(valor ?? '');
  return texto.length > 27 ? `${texto.slice(0, 24)}...` : texto;
}

function prepararDatos(datos: Array<DistribucionItem>, total: number) {
  return datos.map<DistribucionGraficoItem>((item) => {
    const porcentaje = calcularPorcentaje(item.cantidad, total);

    return {
      ...item,
      porcentaje,
      etiqueta: `${formatearEntero.format(item.cantidad)} · ${formatearPorcentaje.format(porcentaje)} %`,
    };
  });
}

function TooltipDistribucion({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DistribucionGraficoItem }>;
}) {
  const item = payload?.[0]?.payload;

  if (!active || !item) {
    return null;
  }

  return (
    <div className="rounded-lg border border-default-200 bg-content1 px-3 py-2 shadow-lg">
      <p className="max-w-64 text-sm font-semibold">{item.nombre}</p>
      <p className="mt-1 text-xs text-default-500">
        {formatearEntero.format(item.cantidad)} proyectos ·{' '}
        {formatearPorcentaje.format(item.porcentaje)} %
      </p>
      {!item.esAgrupado && (
        <p className="mt-1 text-[11px] text-primary">
          Seleccionar para filtrar
        </p>
      )}
    </div>
  );
}

function GraficoDistribucion({
  titulo,
  descripcion,
  datos,
  total,
  colorBase,
  usarColorDato = false,
  onSeleccionar,
  estaSeleccionado,
}: GraficoDistribucionProps) {
  const datosGrafico = prepararDatos(datos, total);
  const altura = Math.max(250, datos.length * 48 + 75);
  const haySeleccion = datos.some((item) => estaSeleccionado?.(item));

  return (
    <Card className="border border-default-200 shadow-sm">
      <CardHeader className="flex-col items-start gap-1 pb-0">
        <h3 className="text-base font-semibold">{titulo}</h3>
        <p className="text-xs text-default-500">{descripcion}</p>
      </CardHeader>

      <CardBody>
        {datos.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center text-sm text-default-500">
            No hay datos para los filtros seleccionados.
          </div>
        ) : (
          <div style={{ height: altura }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosGrafico}
                layout="vertical"
                margin={{ top: 8, right: 118, bottom: 8, left: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  opacity={0.3}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickFormatter={(valor) =>
                    formatearEntero.format(Number(valor))
                  }
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  type="category"
                  dataKey="nombre"
                  width={165}
                  tickFormatter={abreviarEtiqueta}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(127, 127, 127, 0.08)' }}
                  content={<TooltipDistribucion />}
                />

                <Bar
                  dataKey="cantidad"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={28}
                  isAnimationActive={false}
                  onClick={(entrada: unknown) => {
                    const item = (
                      entrada as { payload?: DistribucionItem }
                    ).payload;

                    if (item && !item.esAgrupado) {
                      onSeleccionar?.(item);
                    }
                  }}
                >
                  {datosGrafico.map((item, index) => {
                    const seleccionado = estaSeleccionado?.(item) ?? false;
                    const color = usarColorDato
                      ? normalizarColorEtapa(item.color)
                      : colorBase;

                    return (
                      <Cell
                        key={`${item.id ?? item.nombre}-${index}`}
                        fill={color}
                        fillOpacity={haySeleccion && !seleccionado ? 0.35 : 1}
                        cursor={
                          onSeleccionar && !item.esAgrupado
                            ? 'pointer'
                            : 'default'
                        }
                      />
                    );
                  })}

                  <LabelList
                    dataKey="etiqueta"
                    position="right"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      fill: 'currentColor',
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function GraficoTipos({
  datos,
  total,
  onSeleccionar,
  estaSeleccionado,
}: {
  datos: Array<DistribucionItem>;
  total: number;
  onSeleccionar: (item: DistribucionItem) => void;
  estaSeleccionado: (item: DistribucionItem) => boolean;
}) {
  const datosGrafico = prepararDatos(datos, total);
  const haySeleccion = datos.some(estaSeleccionado);

  return (
    <Card className="border border-default-200 shadow-sm">
      <CardHeader className="flex-col items-start gap-1 pb-0">
        <h3 className="text-base font-semibold">Distribución por tipo</h3>
        <p className="text-xs text-default-500">
          Seleccioná un sector o una categoría para filtrar el listado.
        </p>
      </CardHeader>

      <CardBody>
        {datos.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center text-sm text-default-500">
            No hay datos para los filtros seleccionados.
          </div>
        ) : (
          <div className="grid min-h-72 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(210px,1fr)_minmax(180px,0.85fr)]">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    dataKey="cantidad"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={2}
                    isAnimationActive={false}
                    onClick={(_entrada: unknown, index: number) => {
                      const item = datos[index];

                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                      if (item) {
                        onSeleccionar(item);
                      }
                    }}
                  >
                    {datosGrafico.map((item, index) => {
                      const seleccionado = estaSeleccionado(item);

                      return (
                        <Cell
                          key={`${item.id ?? item.nombre}-${index}`}
                          fill={coloresTipo[index % coloresTipo.length]}
                          fillOpacity={
                            haySeleccion && !seleccionado ? 0.35 : 1
                          }
                          cursor="pointer"
                        />
                      );
                    })}
                  </Pie>

                  <Tooltip content={<TooltipDistribucion />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {datosGrafico.map((item, index) => {
                const seleccionado = estaSeleccionado(item);

                return (
                  <button
                    key={`${item.id ?? item.nombre}-leyenda`}
                    type="button"
                    onClick={() => onSeleccionar(item)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
                      seleccionado
                        ? 'border-primary bg-primary/10'
                        : 'border-default-200 hover:bg-default-100'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            coloresTipo[index % coloresTipo.length],
                        }}
                      />
                      <span className="truncate text-sm font-medium">
                        {item.nombre}
                      </span>
                    </span>

                    <span className="shrink-0 text-xs text-default-500">
                      {formatearEntero.format(item.cantidad)} ·{' '}
                      {formatearPorcentaje.format(item.porcentaje)} %
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function BarraProporcion({
  porcentaje,
  variante,
}: {
  porcentaje: number;
  variante: 'primary' | 'secondary';
}) {
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-default-100">
      <div
        className={`h-full rounded-full transition-all ${
          variante === 'primary' ? 'bg-primary' : 'bg-secondary'
        }`}
        style={{ width: `${Math.min(100, Math.max(0, porcentaje))}%` }}
      />
    </div>
  );
}

export function ProyectosMinerosStats({
  visibleBase,
}: {
  visibleBase?: boolean;
}) {
  const navigate = useNavigate({ from: '/proyectos-mineros/' });

  const {
    nombreLike,
    tiposIds,
    etapasIds,
    minerales,
    ubicaciones,
    propietarios,
    provinciasGeologicas,
    convenioEmse,
    estadoVisible,
    msnmDesde,
    msnmHasta,
  } = useSearch({
    from: '/proyectos-mineros/',
  });


  const visibleFiltro = visibleBase === undefined ? estadoVisible : undefined;

  const tieneFiltrosActivos = Boolean(
    nombreLike?.trim() ||
      tiposIds?.length ||
      etapasIds?.length ||
      minerales?.length ||
      ubicaciones?.length ||
      propietarios?.length ||
      provinciasGeologicas?.length ||
      convenioEmse !== undefined ||
      visibleFiltro !== undefined ||
      msnmDesde !== undefined ||
      msnmHasta !== undefined
  );

  const { data, isFetching, error } = useProyectosMinerosStats({
    nombreLike,
    tiposIds,
    etapasIds,
    minerales,
    ubicaciones,
    propietarios,
    provinciasGeologicas,
    convenioEmse,
    visibleBase,
    visible: visibleFiltro,
    msnmDesde,
    msnmHasta,
  });

  if (error) {
    console.error(error);

    return (
      <section className="mt-8 rounded-xl border border-danger-200 p-6 text-danger">
        No fue posible cargar las estadísticas de proyectos mineros.
      </section>
    );
  }

  if (isFetching || !data) {
    return (
      <section className="mt-8 flex min-h-64 items-center justify-center rounded-xl border border-default-200">
        <Spinner label="Calculando estadísticas..." />
      </section>
    );
  }

  const porcentajeProyectos = calcularPorcentaje(
    data.totalProyectos,
    data.totalGeneral
  );

  const porcentajeSuperficie = calcularPorcentaje(
    data.superficieAcumuladaHectareas,
    data.superficieGeneralHectareas
  );

  const alternarEtapa = (item: DistribucionItem) => {
    if (!item.id) {
      return;
    }

    const yaEsUnico = etapasIds?.length === 1 && etapasIds[0] === item.id;

    navigate({
      search: (prev) => ({
        ...prev,
        etapasIds: yaEsUnico ? undefined : [item.id!],
        page: 1,
      }),
    });
  };

  const alternarTipo = (item: DistribucionItem) => {
    if (!item.id) {
      return;
    }

    const yaEsUnico = tiposIds?.length === 1 && tiposIds[0] === item.id;

    navigate({
      search: (prev) => ({
        ...prev,
        tiposIds: yaEsUnico ? undefined : [item.id!],
        page: 1,
      }),
    });
  };

  const alternarMineral = (item: DistribucionItem) => {
    if (item.esAgrupado) {
      return;
    }

    const yaEsUnico =
      minerales?.length === 1 && minerales[0] === item.nombre;

    navigate({
      search: (prev) => ({
        ...prev,
        minerales: yaEsUnico ? undefined : [item.nombre],
        page: 1,
      }),
    });
  };

  const alternarUbicacion = (item: DistribucionItem) => {
    if (item.esAgrupado) {
      return;
    }

    const yaEsUnico =
      ubicaciones?.length === 1 && ubicaciones[0] === item.nombre;

    navigate({
      search: (prev) => ({
        ...prev,
        ubicaciones: yaEsUnico ? undefined : [item.nombre],
        page: 1,
      }),
    });
  };

  return (
    <section className="mt-10 space-y-5 pb-8">
      <Divider />

      <div className="flex flex-wrap items-start justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <ChartColumnIncreasing className="text-primary" size={22} />
            <h2 className="text-xl font-semibold">
              Estadísticas de proyectos mineros
            </h2>
          </div>

          <p className="mt-1 text-sm text-default-500">
            {tieneFiltrosActivos
              ? 'Resultados correspondientes a los filtros aplicados.'
              : 'Resumen general de los proyectos registrados.'}
          </p>
        </div>

        <Chip
          size="sm"
          variant="flat"
          color={tieneFiltrosActivos ? 'primary' : 'default'}
        >
          {tieneFiltrosActivos
            ? `${formatearEntero.format(data.totalProyectos)} proyectos filtrados`
            : 'Vista general'}
        </Chip>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border border-default-200 shadow-sm">
          <CardBody className="p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <ChartColumnIncreasing size={28} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-default-500">
                  Proyectos registrados
                </p>
                <p className="text-3xl font-bold">
                  {formatearEntero.format(data.totalProyectos)}
                </p>
                <p className="text-xs text-default-400">
                  {tieneFiltrosActivos
                    ? `${formatearEntero.format(data.totalProyectos)} de ${formatearEntero.format(data.totalGeneral)} proyectos`
                    : 'Total disponible en esta vista'}
                </p>
              </div>
            </div>

            <BarraProporcion
              porcentaje={tieneFiltrosActivos ? porcentajeProyectos : 100}
              variante="primary"
            />
          </CardBody>
        </Card>

        <Card className="border border-default-200 shadow-sm">
          <CardBody className="p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
                <MapPinned size={28} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-default-500">
                  Superficie acumulada
                </p>
                <p className="text-3xl font-bold">
                  {formatearHectareas.format(
                    data.superficieAcumuladaHectareas
                  )}{' '}
                  <span className="text-lg font-semibold">ha</span>
                </p>
                <p className="text-xs text-default-400">
                  {tieneFiltrosActivos
                    ? `${formatearHectareas.format(data.superficieAcumuladaHectareas)} de ${formatearHectareas.format(data.superficieGeneralHectareas)} ha`
                    : 'Suma de las superficies informadas'}
                </p>
              </div>
            </div>

            <BarraProporcion
              porcentaje={tieneFiltrosActivos ? porcentajeSuperficie : 100}
              variante="secondary"
            />
          </CardBody>
        </Card>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-default-600">
        <MousePointerClick className="mt-0.5 shrink-0 text-primary" size={17} />
        <p>
          Seleccioná una barra, un sector o una categoría para aplicar ese
          filtro. Volvé a seleccionarlo para quitarlo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GraficoDistribucion
          titulo="Distribución por etapa"
          descripcion="Cantidad y porcentaje en cada etapa de desarrollo. Los colores coinciden con el visor."
          datos={data.porEtapa}
          total={data.totalProyectos}
          colorBase="#64748b"
          usarColorDato
          onSeleccionar={alternarEtapa}
          estaSeleccionado={(item) =>
            item.id !== undefined && Boolean(etapasIds?.includes(item.id))
          }
        />

        <GraficoDistribucion
          titulo="Distribución por mineral"
          descripcion="Principales minerales de interés, ordenados por cantidad."
          datos={data.porMineral}
          total={data.totalProyectos}
          colorBase="#2563eb"
          onSeleccionar={alternarMineral}
          estaSeleccionado={(item) =>
            Boolean(minerales?.includes(item.nombre))
          }
        />

        <GraficoTipos
          datos={data.porTipo}
          total={data.totalProyectos}
          onSeleccionar={alternarTipo}
          estaSeleccionado={(item) =>
            item.id !== undefined && Boolean(tiposIds?.includes(item.id))
          }
        />

        <GraficoDistribucion
          titulo="Distribución por ubicación"
          descripcion="Cantidad y porcentaje según la ubicación declarada."
          datos={data.porUbicacion}
          total={data.totalProyectos}
          colorBase="#9333ea"
          onSeleccionar={alternarUbicacion}
          estaSeleccionado={(item) =>
            Boolean(ubicaciones?.includes(item.nombre))
          }
        />
      </div>
    </section>
  );
}
