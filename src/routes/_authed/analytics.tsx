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
import { useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';
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
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6 mt-4">
      <SectionTitle title={t('routes.admin.analytics.page.title')} subtitle={t('routes.admin.analytics.page.subtitle')} />
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        }
      >
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}

function AnalyticsDashboard() {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(analyticsStatsQuery());

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label={t('routes.admin.analytics.kpis.visitantes30d')} value={data.visitorsUnicos30d} />
        <KpiCard label={t('routes.admin.analytics.kpis.sesiones30d')} value={data.sesiones30d} />
        <KpiCard label={t('routes.admin.analytics.kpis.sesiones7d')} value={data.sesiones7d} />
        <KpiCard label={t('routes.admin.analytics.kpis.paginas30d')} value={data.visitas30d} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Top páginas */}
        <Card>
          <CardHeader className="font-semibold">{t('routes.admin.analytics.paginas')}</CardHeader>
          <CardBody>
            {data.topPathnames.length === 0 ? (
              <p className="text-sm text-default-400">{t('common.estados.sinDatos')}</p>
            ) : (
              <Table aria-label={t('routes.admin.analytics.paginas')} removeWrapper>
                <TableHeader>
                  <TableColumn>{t('routes.admin.analytics.columnas.ruta')}</TableColumn>
                  <TableColumn>{t('routes.admin.analytics.columnas.vistas')}</TableColumn>
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
          <CardHeader className="font-semibold">{t('routes.admin.analytics.dispositivos')}</CardHeader>
          <CardBody>
            {data.dispositivos.length === 0 ? (
              <p className="text-sm text-default-400">{t('common.estados.sinDatos')}</p>
            ) : (
              <Table aria-label={t('routes.admin.analytics.dispositivos')} removeWrapper>
                <TableHeader>
                  <TableColumn>{t('routes.admin.analytics.columnas.dispositivo')}</TableColumn>
                  <TableColumn>{t('routes.admin.analytics.columnas.sesiones')}</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.dispositivos.map((d) => (
                    <TableRow key={d.device ?? 'desconocido'}>
                      <TableCell className="capitalize">{d.device ?? t('common.estados.desconocido')}</TableCell>
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
          <CardHeader className="font-semibold">{t('routes.admin.analytics.paises')}</CardHeader>
          <CardBody>
            {data.paises.length === 0 ? (
              <p className="text-sm text-default-400">{t('routes.admin.analytics.sinDatosPais')}</p>
            ) : (
              <Table aria-label={t('routes.admin.analytics.paises')} removeWrapper>
                <TableHeader>
                  <TableColumn>{t('routes.admin.analytics.columnas.paisIso')}</TableColumn>
                  <TableColumn>{t('routes.admin.analytics.columnas.sesiones')}</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.paises.map((p) => (
                    <TableRow key={p.country ?? 'desconocido'}>
                      <TableCell>{p.country ?? t('common.estados.desconocido')}</TableCell>
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
