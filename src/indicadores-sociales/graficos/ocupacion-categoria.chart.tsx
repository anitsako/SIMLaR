import { Card, CardBody } from '@heroui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

type OcupacionPorCategoria = {
  categoria: string;
  mujeres: number;
  varones: number;
};

type OcupacionCategoriaChartProps = {
  datos: Array<OcupacionPorCategoria>;
};

const formatearNumero = (valor: number): string =>
  valor.toLocaleString('es-AR');

const acortarCategoria = (categoria: string): string => {
  const nombres: Record<string, string> = {
    'Obrero/a o empleado/a': 'routes.inicio.departamento.graficos.ocupacion.categorias.obrero',
    'Patrón/a': 'routes.inicio.departamento.graficos.ocupacion.categorias.patron',
    'Trabajador/a por cuenta propia': 'routes.inicio.departamento.graficos.ocupacion.categorias.cuentaPropia',
    'Trabajador/a familiar': 'routes.inicio.departamento.graficos.ocupacion.categorias.familiar',
  };

  return nombres[categoria] ? i18n.t(nombres[categoria]) : categoria;
};

export function OcupacionCategoriaChart({
  datos,
}: OcupacionCategoriaChartProps) {
  const { t } = useTranslation();
  const datosGrafico = datos.map((fila) => ({
    categoria: acortarCategoria(fila.categoria),
    mujeres: fila.mujeres,
    varones: fila.varones,
    total: fila.mujeres + fila.varones,
  }));

  const totalMujeres = datos.reduce(
    (total, fila) => total + fila.mujeres,
    0
  );

  const totalVarones = datos.reduce(
    (total, fila) => total + fila.varones,
    0
  );

  const totalOcupados = totalMujeres + totalVarones;

  const categoriaPrincipal = datosGrafico.reduce<
    (typeof datosGrafico)[number] | null
  >((mayor, fila) => {
    if (!mayor) {
      return fila;
    }

    return fila.total > mayor.total ? fila : mayor;
  }, null);

  const participacionMujeres =
    totalOcupados > 0
      ? (totalMujeres / totalOcupados) * 100
      : 0;

  const participacionVarones =
    totalOcupados > 0
      ? (totalVarones / totalOcupados) * 100
      : 0;

  return (
    <Card
      shadow="sm"
      className="border border-default-200"
    >
      <CardBody className="gap-5 p-5">
        <div>
          <h3 className="text-lg font-semibold">
            {t('routes.inicio.departamento.graficos.ocupacion.titulo')}
          </h3>

          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.graficos.ocupacion.descripcion')}
          </p>
        </div>

        <div className="h-110 w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={datosGrafico}
              layout="vertical"
              margin={{
                top: 10,
                right: 30,
                bottom: 10,
                left: 20,
              }}
              barCategoryGap={18}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e5e7eb"
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickFormatter={(valor) =>
                  formatearNumero(Number(valor))
                }
              />

              <YAxis
                type="category"
                dataKey="categoria"
                width={150}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(0, 0, 0, 0.04)',
                }}
                formatter={(valor, nombre) => [
                  t('routes.inicio.departamento.graficos.ocupacion.personas', {
                    valor: formatearNumero(Math.abs(Number(valor))),
                  }),
                  String(nombre),
                ]}
              />

              <Legend
                verticalAlign="top"
                height={36}
              />

              <Bar
                dataKey="mujeres"
                name={t('routes.inicio.departamento.mujeres')}
                fill="#c83d43"
                radius={[0, 6, 6, 0]}
                maxBarSize={24}
                isAnimationActive={false}
              />

              <Bar
                dataKey="varones"
                name={t('routes.inicio.departamento.varones')}
                fill="#4f78a8"
                radius={[0, 6, 6, 0]}
                maxBarSize={24}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-default-50 px-4 py-3">
            <p className="text-sm text-default-500">
              {t('routes.inicio.departamento.graficos.ocupacion.totalOcupada')}
            </p>

            <p className="mt-1 text-xl font-semibold">
              {formatearNumero(totalOcupados)}
            </p>

            <p className="text-xs text-default-400">
              {t('routes.inicio.departamento.graficos.ocupacion.personas14')}
            </p>
          </div>

          <div className="rounded-xl bg-default-50 px-4 py-3">
            <p className="text-sm text-default-500">
              {t('routes.inicio.departamento.graficos.ocupacion.categoriaPrincipal')}
            </p>

            <p className="mt-1 text-lg font-semibold">
              {categoriaPrincipal?.categoria ?? t('common.estados.sinDato')}
            </p>

            <p className="text-xs text-default-400">
              {categoriaPrincipal
                ? t('routes.inicio.departamento.graficos.ocupacion.personas', {
                    valor: formatearNumero(categoriaPrincipal.total),
                  })
                : t('routes.inicio.departamento.graficos.ocupacion.sinInformacion')}
            </p>
          </div>

          <div className="rounded-xl bg-default-50 px-4 py-3">
            <p className="text-sm text-default-500">
              {t('routes.inicio.departamento.graficos.distribucionSexo.titulo')}
            </p>

            <p className="mt-1 text-sm font-semibold">
              {t('routes.inicio.departamento.mujeres')}:{' '}
              {participacionMujeres.toLocaleString('es-AR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              %
            </p>

            <p className="text-sm font-semibold">
              {t('routes.inicio.departamento.varones')}:{' '}
              {participacionVarones.toLocaleString('es-AR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              %
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}