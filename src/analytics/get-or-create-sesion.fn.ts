import { createServerFn } from '@tanstack/react-start';
import { getCookie, getRequestHeader, setCookie } from '@tanstack/react-start/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { parseUserAgent } from './parse-user-agent';
import { db } from '@/db';
import { analyticsSesiones } from '@/db/schemas/analytics-sesiones.schema';

export const getOrCreateSesionFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      language: z.string().nullable(),
      screenResolution: z.string().nullable(),
      referrer: z.string().nullable(),
      utmSource: z.string().nullable(),
      utmMedium: z.string().nullable(),
      utmCampaign: z.string().nullable(),
      utmTerm: z.string().nullable(),
      utmContent: z.string().nullable(),
    })
  )
  .handler(async ({ data }) => {
    // Visitor ID: long-lived cookie (1 year), anonymous UUID, no PII
    let visitorId = getCookie('analytics_visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      setCookie('analytics_visitor_id', visitorId, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    }

    // Session ID: session cookie (cleared when browser closes)
    const existingSessionId = getCookie('analytics_session_id');
    if (existingSessionId) {
      const rows = await db
        .select({ id: analyticsSesiones.id })
        .from(analyticsSesiones)
        .where(eq(analyticsSesiones.id, existingSessionId))
        .limit(1);

      if (rows.length > 0) {
        await db
          .update(analyticsSesiones)
          .set({ lastSeenAt: new Date() })
          .where(eq(analyticsSesiones.id, existingSessionId));
        return { sessionId: existingSessionId };
      }
    }

    // Create new session
    const userAgent = getRequestHeader('user-agent') ?? null;
    const { browser, os, device } = userAgent
      ? parseUserAgent(userAgent)
      : { browser: null, os: null, device: 'desktop' as const };

    const rawCountry = getRequestHeader('cf-ipcountry') ?? null;
    const country = rawCountry && rawCountry !== 'XX' ? rawCountry.slice(0, 2).toUpperCase() : null;
    const region = getRequestHeader('cf-region-code') ?? null;

    const [session] = await db
      .insert(analyticsSesiones)
      .values({
        visitorId,
        userAgent,
        browser,
        os,
        device,
        language: data.language,
        screenResolution: data.screenResolution,
        country,
        region,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmTerm: data.utmTerm,
        utmContent: data.utmContent,
      })
      .returning({ id: analyticsSesiones.id });

    setCookie('analytics_session_id', session.id, {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });

    return { sessionId: session.id };
  });
