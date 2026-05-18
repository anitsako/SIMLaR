import { createServerFn } from '@tanstack/react-start';
import { and, count, countDistinct, desc, gte, isNotNull } from 'drizzle-orm';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { analyticsSesiones } from '@/db/schemas/analytics-sesiones.schema';
import { analyticsVisitas } from '@/db/schemas/analytics-visitas.schema';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export const getAnalyticsStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession();
  if (!session.data.usuarioId) throw new Error('Not authenticated');

  const since30d = daysAgo(30);
  const since7d = daysAgo(7);

  const [
    [sesiones30d],
    [sesiones7d],
    [visitas30d],
    [visitorsUnicos30d],
    topPathnames,
    dispositivos,
    paises,
  ] = await Promise.all([
    db.select({ total: count() }).from(analyticsSesiones).where(gte(analyticsSesiones.startedAt, since30d)),
    db.select({ total: count() }).from(analyticsSesiones).where(gte(analyticsSesiones.startedAt, since7d)),
    db.select({ total: count() }).from(analyticsVisitas).where(gte(analyticsVisitas.viewedAt, since30d)),
    db
      .select({ total: countDistinct(analyticsSesiones.visitorId) })
      .from(analyticsSesiones)
      .where(gte(analyticsSesiones.startedAt, since30d)),
    db
      .select({ pathname: analyticsVisitas.pathname, views: count() })
      .from(analyticsVisitas)
      .where(gte(analyticsVisitas.viewedAt, since30d))
      .groupBy(analyticsVisitas.pathname)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({ device: analyticsSesiones.device, total: count() })
      .from(analyticsSesiones)
      .where(and(gte(analyticsSesiones.startedAt, since30d), isNotNull(analyticsSesiones.device)))
      .groupBy(analyticsSesiones.device)
      .orderBy(desc(count())),
    db
      .select({ country: analyticsSesiones.country, total: count() })
      .from(analyticsSesiones)
      .where(and(gte(analyticsSesiones.startedAt, since30d), isNotNull(analyticsSesiones.country)))
      .groupBy(analyticsSesiones.country)
      .orderBy(desc(count()))
      .limit(10),
  ]);

  return {
    sesiones30d: sesiones30d.total,
    sesiones7d: sesiones7d.total,
    visitas30d: visitas30d.total,
    visitorsUnicos30d: visitorsUnicos30d.total,
    topPathnames,
    dispositivos,
    paises,
  };
});

