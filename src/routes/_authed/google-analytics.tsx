import { Suspense } from 'react';
import {
  Alert,
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
import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';
import { getGoogleAnalyticsStatsFn } from '@/analytics/get-google-analytics-stats.fn';

const googleAnalyticsStatsQuery = () =>
  queryOptions({
    queryKey: ['google-analytics-stats'],
    queryFn: () => getGoogleAnalyticsStatsFn(),
    staleTime: 60 * 1000,
  });

export const Route = createFileRoute('/_authed/google-analytics')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(googleAnalyticsStatsQuery()),
  errorComponent: ({ error }) => {
    const { t } = useTranslation();

    if (error instanceof Error && (error.message === 'Not authenticated' || error.message.startsWith('Missing GA_'))) {
      return (
        <div className="max-w-6xl w-full mt-4">
          <Alert
            color="danger"
            title={
              error.message === 'Not authenticated' ? t('routes.admin.googleAnalytics.noAutorizado') : t('routes.admin.googleAnalytics.faltaConfigurar')
            }
          />
        </div>
      );
    }

    throw error;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6 mt-4">
      <SectionTitle title={t('routes.admin.googleAnalytics.page.title')} subtitle={t('routes.admin.googleAnalytics.page.subtitle')} />
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        }
      >
        <GoogleAnalyticsDashboard />
      </Suspense>
    </div>
  );
}

function GoogleAnalyticsDashboard() {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(googleAnalyticsStatsQuery());

  if (data === null) {
    return (
      <div className="max-w-6xl w-full mt-4">
        <Alert color="danger" title={t('routes.admin.googleAnalytics.faltaConfigurar')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <MetricCard label={t('routes.admin.googleAnalytics.metricas.usuariosActivos')} value={data.activeUsers30d} />
        <MetricCard label={t('routes.admin.googleAnalytics.metricas.sesiones')} value={data.sessions30d} />
        <MetricCard label={t('routes.admin.googleAnalytics.metricas.vistas')} value={data.screenPageViews30d} />
        <MetricCard label={t('routes.admin.googleAnalytics.metricas.tasaEngagement')} value={formatPercent(data.engagementRate30d)} />
        <MetricCard label={t('routes.admin.googleAnalytics.metricas.tiempoEngagement')} value={formatDuration(data.averageSessionDuration30d)} />
        <MetricCard label={t('routes.admin.googleAnalytics.metricas.usuariosNuevos')} value={data.newUsers30d} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DataCard title={t('routes.admin.googleAnalytics.paginas')}>
          <MetricTable
            emptyLabel={t('common.estados.sinDatos')}
            rowLabel={t('routes.admin.googleAnalytics.columnas.ruta')}
            valueLabel={t('routes.admin.googleAnalytics.columnas.vistas')}
            rows={data.topPages.map((row, index) => ({
              key: `${row.value}-${index}`,
              label: row.value,
              value: row.total,
            }))}
          />
        </DataCard>

        <DataCard title={t('routes.admin.googleAnalytics.paises')}>
          <MetricTable
            emptyLabel={t('routes.admin.googleAnalytics.sinDatosPais')}
            rowLabel={t('routes.admin.googleAnalytics.columnas.pais')}
            valueLabel={t('routes.admin.googleAnalytics.columnas.sesiones')}
            rows={data.countries.map((row, index) => ({
              key: `${row.value}-${index}`,
              label: row.value,
              value: row.total,
            }))}
          />
        </DataCard>

        <DataCard title={t('routes.admin.googleAnalytics.dispositivos')}>
          <MetricTable
            emptyLabel={t('common.estados.sinDatos')}
            rowLabel={t('routes.admin.googleAnalytics.columnas.dispositivo')}
            valueLabel={t('routes.admin.googleAnalytics.columnas.sesiones')}
            rows={data.devices.map((row, index) => ({
              key: `${row.value}-${index}`,
              label: row.value,
              value: row.total,
            }))}
          />
        </DataCard>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardBody className="text-center">
        <p className="text-3xl font-bold text-primary">
          {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
        </p>
        <p className="mt-1 text-xs text-default-500">{label}</p>
      </CardBody>
    </Card>
  );
}

function DataCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="font-semibold">{title}</CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function MetricTable({
  rows,
  rowLabel,
  valueLabel,
  emptyLabel,
}: {
  rows: Array<{ key: string; label: string; value: number }>;
  rowLabel: string;
  valueLabel: string;
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-default-400">{emptyLabel}</p>;
  }

  return (
    <Table aria-label={rowLabel} removeWrapper>
      <TableHeader>
        <TableColumn>{rowLabel}</TableColumn>
        <TableColumn>{valueLabel}</TableColumn>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="max-w-0 truncate">{row.label}</TableCell>
            <TableCell>{row.value.toLocaleString('es-AR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDuration(seconds: number) {
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
