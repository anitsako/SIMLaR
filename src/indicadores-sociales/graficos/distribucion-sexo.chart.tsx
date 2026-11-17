import { Card, CardBody } from '@heroui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';

type DistribucionSexoChartProps = {
  mujeres: number;
  varones: number;
};

const formatearNumero = (valor: number): string =>
  valor.toLocaleString('es-AR');

const formatearPorcentaje = (valor: number): string =>
  valor.toLocaleString('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

export function DistribucionSexoChart({
  mujeres,
  varones,
}: DistribucionSexoChartProps) {
  const { t } = useTranslation();
  const total = mujeres + varones;

  const porcentajeMujeres =
    total > 0 ? (mujeres / total) * 100 : 0;

  const porcentajeVarones =
    total > 0 ? (varones / total) * 100 : 0;

  const datos = [
    {
      grupo: t('routes.inicio.departamento.poblacion2022'),
      mujeres: porcentajeMujeres,
      varones: porcentajeVarones,
    },
  ];

  return (
    <Card
      shadow="sm"
      className="border border-default-200"
    >
      <CardBody className="gap-5 p-5">
        <div>
          <h3 className="text-lg font-semibold">
            {t('routes.inicio.departamento.graficos.distribucionSexo.titulo')}
          </h3>

          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.graficos.distribucionSexo.descripcion')}
          </p>
        </div>

        <div className="h-52 w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={datos}
              layout="vertical"
              margin={{
                top: 20,
                right: 10,
                bottom: 20,
                left: 10,
              }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e5e7eb"
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(valor) => `${valor} %`}
              />

              <YAxis
                type="category"
                dataKey="grupo"
                hide
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(0, 0, 0, 0.04)',
                }}
                formatter={(valor, nombre) => {
                  const porcentaje = Number(valor);

                  const cantidad =
                    nombre === t('routes.inicio.departamento.mujeres')
                      ? mujeres
                      : varones;

                  return [
                    t('routes.inicio.departamento.graficos.distribucionSexo.tooltip', {
                      cantidad: formatearNumero(cantidad),
                      porcentaje: formatearPorcentaje(porcentaje),
                    }),
                    String(nombre),
                  ];
                }}
              />

              <Bar
                dataKey="mujeres"
                name={t('routes.inicio.departamento.mujeres')}
                stackId="sexo"
                fill="#c83d43"
                radius={[8, 0, 0, 8]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="mujeres"
                  position="center"
                  fill="#ffffff"
                  fontWeight={600}
                  formatter={(valor) =>
                    `${formatearPorcentaje(
                      Number(valor)
                    )} %`
                  }
                />
              </Bar>

              <Bar
                dataKey="varones"
                name={t('routes.inicio.departamento.varones')}
                stackId="sexo"
                fill="#4f78a8"
                radius={[0, 8, 8, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="varones"
                  position="center"
                  fill="#ffffff"
                  fontWeight={600}
                  formatter={(valor) =>
                    `${formatearPorcentaje(
                      Number(valor)
                    )} %`
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-default-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#c83d43]" />

              <p className="text-sm font-medium">
                {t('routes.inicio.departamento.mujeres')}
              </p>
            </div>

            <p className="mt-2 text-xl font-semibold">
              {formatearNumero(mujeres)}
            </p>

            <p className="text-xs text-default-500">
              {formatearPorcentaje(
                porcentajeMujeres
              )}{' '}
              {t('routes.inicio.departamento.graficos.distribucionSexo.porcentajePoblacion')}
            </p>
          </div>

          <div className="rounded-xl bg-default-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#4f78a8]" />

              <p className="text-sm font-medium">
                {t('routes.inicio.departamento.varones')}
              </p>
            </div>

            <p className="mt-2 text-xl font-semibold">
              {formatearNumero(varones)}
            </p>

            <p className="text-xs text-default-500">
              {formatearPorcentaje(
                porcentajeVarones
              )}{' '}
              {t('routes.inicio.departamento.graficos.distribucionSexo.porcentajePoblacion')}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}