import { Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import SectionTitle from '@/common/sectionTitle';
import { getAnalyticsStatsFn } from '@/analytics/get-analytics-stats.fn';

const analyticsStatsQuery = () =>
  queryOptions({
    queryKey: ['analytics-stats'],
    queryFn: () => getAnalyticsStatsFn(),
    staleTime: 60 * 1000,
  });

export const Route = createFileRoute('/_authed/analytics')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(analyticsStatsQuery()),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <SectionTitle title="Analytics" subtitle="Últimos 30 días" sizeTitle="5xl" textCenter />
      <Suspense fallback={<div className="flex justify-center py-10"><Spinner /></div>}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}

function AnalyticsDashboard() {
  const { data } = useSuspenseQuery(analyticsStatsQuery());

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Visitantes únicos (30d)" value={data.visitorsUnicos30d} />
        <KpiCard label="Sesiones (30d)" value={data.sesiones30d} />
        <KpiCard label="Sesiones (7d)" value={data.sesiones7d} />
        <KpiCard label="Páginas vistas (30d)" value={data.visitas30d} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Top páginas */}
        <Card>
          <CardHeader className="font-semibold">Páginas más vistas</CardHeader>
          <CardBody>
            {data.topPathnames.length === 0 ? (
              <p className="text-sm text-default-400">Sin datos.</p>
            ) : (
              <Table aria-label="Páginas más vistas" removeWrapper>
                <TableHeader>
                  <TableColumn>Ruta</TableColumn>
                  <TableColumn>Vistas</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.topPathnames.map((r) => (
                    <TableRow key={r.pathname}>
                      <TableCell className="font-mono text-sm">{r.pathname}</TableCell>
                      <TableCell>{r.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Dispositivos */}
        <Card>
          <CardHeader className="font-semibold">Dispositivos</CardHeader>
          <CardBody>
            {data.dispositivos.length === 0 ? (
              <p className="text-sm text-default-400">Sin datos.</p>
            ) : (
              <Table aria-label="Dispositivos" removeWrapper>
                <TableHeader>
                  <TableColumn>Dispositivo</TableColumn>
                  <TableColumn>Sesiones</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.dispositivos.map((d) => (
                    <TableRow key={d.device ?? 'desconocido'}>
                      <TableCell className="capitalize">{d.device ?? 'Desconocido'}</TableCell>
                      <TableCell>{d.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Países */}
        <Card>
          <CardHeader className="font-semibold">Países</CardHeader>
          <CardBody>
            {data.paises.length === 0 ? (
              <p className="text-sm text-default-400">Sin datos de país disponibles.</p>
            ) : (
              <Table aria-label="Países" removeWrapper>
                <TableHeader>
                  <TableColumn>País (ISO)</TableColumn>
                  <TableColumn>Sesiones</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.paises.map((p) => (
                    <TableRow key={p.country ?? 'desconocido'}>
                      <TableCell>{p.country ?? 'Desconocido'}</TableCell>
                      <TableCell>{p.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardBody className="text-center">
        <p className="text-3xl font-bold text-primary">{value.toLocaleString('es-AR')}</p>
        <p className="text-xs text-default-500 mt-1">{label}</p>
      </CardBody>
    </Card>
  );
}
