import { createServerFn } from '@tanstack/react-start';
import { getGoogleAnalyticsClient } from './get-google-analytics-client';

type ReportRow = {
  dimensionValues?: Array<{ value?: string | null }>;
  metricValues?: Array<{ value?: string | null }>;
};

export const getGoogleAnalyticsStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const client = await getGoogleAnalyticsClient();
  const property = getGoogleAnalyticsProperty();

  if (!client || !property) {
    return null;
  }

  const [overview, topPages, countries, devices] = await Promise.all([
    client.runReport({
      property,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
      ],
    }),
    client.runReport({
      property,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePathPlusQueryString' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    }),
    client.runReport({
      property,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    }),
    client.runReport({
      property,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    }),
  ]);

  const overviewRow = overview[0].rows?.[0] as ReportRow | undefined;

  return {
    activeUsers30d: getMetricValue(overviewRow, 0),
    sessions30d: getMetricValue(overviewRow, 1),
    screenPageViews30d: getMetricValue(overviewRow, 2),
    engagementRate30d: getMetricValue(overviewRow, 3),
    averageSessionDuration30d: getMetricValue(overviewRow, 4),
    newUsers30d: getMetricValue(overviewRow, 5),
    topPages: mapDimensionReport(topPages[0].rows as Array<ReportRow>),
    countries: mapDimensionReport(countries[0].rows as Array<ReportRow>),
    devices: mapDimensionReport(devices[0].rows as Array<ReportRow>),
  };
});

function getGoogleAnalyticsProperty() {
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId) {
    console.error('Missing GA_PROPERTY_ID');
    return null;
  }

  return `properties/${propertyId}`;
}

function getMetricValue(row: ReportRow | undefined, index: number) {
  return Number(row?.metricValues?.[index]?.value ?? 0);
}

function mapDimensionReport(rows: Array<ReportRow> | null | undefined) {
  return (rows ?? []).map((row) => ({
    value: row.dimensionValues?.[0]?.value ?? 'Desconocido',
    total: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}
