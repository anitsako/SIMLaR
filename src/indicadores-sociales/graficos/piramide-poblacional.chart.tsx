import { Card, CardBody } from '@heroui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type PoblacionEdadSexo = {
  grupoEdad: string;
  mujeres: number;
  varones: number;
};

type PiramidePoblacionalChartProps = {
  datos: Array<PoblacionEdadSexo>;
};

const formatearNumero = (valor: number): string =>
  valor.toLocaleString('es-AR');

export function PiramidePoblacionalChart({
  datos,
}: PiramidePoblacionalChartProps) {
  /*
   * Se invierte el orden para mostrar:
   * - edades mayores arriba;
   * - edades menores abajo.
   *
   * Los varones se convierten en valores negativos
   * para que sus barras se dibujen hacia la izquierda.
   */
  const datosGrafico = [...datos]
    .reverse()
    .map((fila) => ({
      grupoEdad: fila.grupoEdad,
      mujeres: fila.mujeres,
      varones: -fila.varones,
    }));

  const valorMaximo = Math.max(
    1,
    ...datos.flatMap((fila) => [
      fila.mujeres,
      fila.varones,
    ])
  );

  /*
   * Agregamos un pequeño margen lateral para que
   * las barras no lleguen al límite del gráfico.
   */
  const limiteEje = Math.ceil(valorMaximo * 1.15);

  const totalMujeres = datos.reduce(
    (total, fila) => total + fila.mujeres,
    0
  );

  const totalVarones = datos.reduce(
    (total, fila) => total + fila.varones,
    0
  );

  const totalPoblacion = totalMujeres + totalVarones;

  const grupoMasNumeroso = datos.reduce(
    (mayor, fila) => {
      const totalFila = fila.mujeres + fila.varones;
      const totalMayor =
        mayor.mujeres + mayor.varones;

      return totalFila > totalMayor ? fila : mayor;
    },
    datos[0]
  );

  return (
    <Card
      shadow="sm"
      className="border border-default-200"
    >
      <CardBody className="gap-5 p-5">
        <div>
          <h3 className="text-lg font-semibold">
            Pirámide poblacional
          </h3>

          <p className="text-sm text-default-500">
            Distribución de la población por grupos de edad y
            sexo. Los varones se muestran a la izquierda y las
            mujeres a la derecha.
          </p>
        </div>

        <div className="h-180 w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={datosGrafico}
              layout="vertical"
              stackOffset="sign"
              margin={{
                top: 10,
                right: 25,
                bottom: 15,
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
                domain={[-limiteEje, limiteEje]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(valor) =>
                  formatearNumero(
                    Math.abs(Number(valor))
                  )
                }
              />

              <YAxis
                type="category"
                dataKey="grupoEdad"
                width={90}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              <ReferenceLine
                x={0}
                stroke="#6b7280"
                strokeWidth={1}
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(0, 0, 0, 0.04)',
                }}
                labelFormatter={(etiqueta) =>
                  `Grupo de edad: ${String(etiqueta)}`
                }
                formatter={(valor, nombre) => [
                  `${formatearNumero(
                    Math.abs(Number(valor))
                  )} habitantes`,
                  String(nombre),
                ]}
              />

              <Legend
                verticalAlign="top"
                height={36}
              />

              <Bar
                dataKey="varones"
                name="Varones"
                stackId="poblacion"
                fill="#4f78a8"
                radius={[6, 0, 0, 6]}
                isAnimationActive={false}
              />

              <Bar
                dataKey="mujeres"
                name="Mujeres"
                stackId="poblacion"
                fill="#c83d43"
                radius={[0, 6, 6, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-default-50 px-4 py-3">
            <p className="text-sm text-default-500">
              Población representada
            </p>

            <p className="mt-1 text-xl font-semibold">
              {formatearNumero(totalPoblacion)}
            </p>

            <p className="text-xs text-default-400">
              habitantes
            </p>
          </div>

          <div className="rounded-xl bg-default-50 px-4 py-3">
            <p className="text-sm text-default-500">
              Grupo más numeroso
            </p>

            <p className="mt-1 text-xl font-semibold">
              {grupoMasNumeroso.grupoEdad}
            </p>

            <p className="text-xs text-default-400">
              {formatearNumero(
                grupoMasNumeroso.mujeres +
                  grupoMasNumeroso.varones
              )}{' '}
              habitantes
            </p>
          </div>

          <div className="rounded-xl bg-default-50 px-4 py-3">
            <p className="text-sm text-default-500">
              Composición
            </p>

            <p className="mt-1 text-sm font-semibold">
              Mujeres: {formatearNumero(totalMujeres)}
            </p>

            <p className="text-sm font-semibold">
              Varones: {formatearNumero(totalVarones)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}