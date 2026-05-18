import { index, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Una sesión = una visita continua de un visitor
export const analyticsSesiones = pgTable(
  'analytics_sesiones',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    visitorId: varchar('visitor_id', { length: 255 }).notNull(), // cookie anónima, sin PII
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }), // nullable, se setea al cerrar sesión
    // contexto del navegador
    userAgent: varchar('user_agent', { length: 1024 }),
    browser: varchar('browser', { length: 255 }),
    os: varchar('os', { length: 255 }),
    device: varchar('device', { length: 50 }), // 'mobile' | 'desktop' | 'tablet'
    language: varchar('language', { length: 35 }), // navigator.language, e.g. 'es-AR'
    screenResolution: varchar('screen_resolution', { length: 20 }), // e.g. '1920x1080'
    // contexto geográfico (via CF-IPCountry header u otro)
    country: varchar('country', { length: 2 }), // ISO 3166-1 alpha-2
    region: varchar('region', { length: 255 }),
    // fuente de tráfico
    referrer: varchar('referrer', { length: 1024 }),
    utmSource: varchar('utm_source', { length: 255 }),
    utmMedium: varchar('utm_medium', { length: 255 }),
    utmCampaign: varchar('utm_campaign', { length: 255 }),
    utmTerm: varchar('utm_term', { length: 255 }),
    utmContent: varchar('utm_content', { length: 255 }),
  },
  (t) => [
    index('idx_sesiones_visitor').on(t.visitorId),
    index('idx_sesiones_started').on(t.startedAt),
    index('idx_sesiones_visitor_started').on(t.visitorId, t.startedAt), // journey del visitor
  ]
);
