import { Card, CardBody } from '@heroui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type PoblacionComparativaChartProps = {
  poblacion2010: number;
  poblacion2022: number;
};

const formatearNumero = (valor: number): string =>
  valor.toLocaleString('es-AR');

export function PoblacionComparativaChart({
  poblacion2010,
  poblacion2022,
}: PoblacionComparativaChartProps) {
  const datos = [
    {
      anio: '2010',
      poblacion: poblacion2010,
      color: '#9ca3af',
    },
    {
      anio: '2022',
      poblacion: poblacion2022,
      color: '#c83d43',
    },
  ];

  const variacionAbsoluta =
    poblacion2022 - poblacion2010;

  const variacionRelativa =
    poblacion2010 > 0
      ? (variacionAbsoluta / poblacion2010) * 100
      : null;

  return (
    <Card
      shadow="sm"
      className="border border-default-200"
    >
      <CardBody className="gap-5 p-5">
        <div>
          <h3 className="text-lg font-semibold">
            Evolución de la población
          </h3>

          <p className="text-sm text-default-500">
            Comparación entre los censos 2010 y 2022.
          </p>
        </div>

        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={datos}
              margin={{
                top: 15,
                right: 20,
                bottom: 5,
                left: 10,
              }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="anio"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                width={85}
                axisLine={false}
                tickLine={false}
                tickFormatter={(valor) =>
                  formatearNumero(Number(valor))
                }
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(0, 0, 0, 0.04)',
                }}
                labelFormatter={(etiqueta) =>
                  `Censo ${String(etiqueta)}`
                }
                formatter={(valor) => [
                  `${formatearNumero(
                    Number(valor)
                  )} habitantes`,
                  'Población',
                ]}
              />

              <Bar
                dataKey="poblacion"
                radius={[8, 8, 0, 0]}
                maxBarSize={100}
                isAnimationActive={false}
              >
                {datos.map((dato) => (
                  <Cell
                    key={dato.anio}
                    fill={dato.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-default-50 px-4 py-3">
          <p className="text-sm text-default-600">
            Entre 2010 y 2022 la población{' '}
            {variacionAbsoluta >= 0
              ? 'aumentó'
              : 'disminuyó'}{' '}
            en{' '}
            <strong>
              {formatearNumero(
                Math.abs(variacionAbsoluta)
              )}{' '}
              habitantes
            </strong>
            {variacionRelativa !== null
              ? `, equivalente a un ${Math.abs(
                  variacionRelativa
                ).toLocaleString('es-AR', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })} %.`
              : '.'}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}