import { index, integer, pgTable, smallint, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { analyticsSesiones } from './analytics-sesiones.schema';

// Cada página vista dentro de una sesión
export const analyticsVisitas = pgTable(
  'analytics_visitas',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .references(() => analyticsSesiones.id, { onDelete: 'cascade' })
      .notNull(),
    pathname: varchar('pathname', { length: 1024 }).notNull(),
    title: varchar('title', { length: 1024 }),
    durationMs: integer('duration_ms'), // tiempo en página (enviado al salir)
    scrollDepthPct: smallint('scroll_depth_pct'), // 0-100, profundidad máxima de scroll
    viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('idx_visitas_session').on(t.sessionId),
    index('idx_visitas_pathname').on(t.pathname),
    index('idx_visitas_viewed').on(t.viewedAt),
    index('idx_visitas_session_viewed').on(t.sessionId, t.viewedAt), // timeline de navegación
  ]
);
