import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { AnalyticsContext } from './analytics-context';
import { getOrCreateSesionFn } from './get-or-create-sesion.fn';
import { trackVisitaFn } from './track-visita.fn';
import { updateVisitaDuracionFn } from './update-visita-duracion.fn';
import type { ReactNode } from 'react';

export function AnalyticsTracker({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const location = useLocation();

  const currentVisitaId = useRef<string | null>(null);
  const pageStartTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);

  // Initialize analytics session on mount (client-only via useEffect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    getOrCreateSesionFn({
      data: {
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        referrer: document.referrer || null,
        utmSource: params.get('utm_source'),
        utmMedium: params.get('utm_medium'),
        utmCampaign: params.get('utm_campaign'),
        utmTerm: params.get('utm_term'),
        utmContent: params.get('utm_content'),
      },
    }).then(({ sessionId }) => setSessionId(sessionId));
  }, []);

  // Track max scroll depth per page
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const pct = Math.round(((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100);
      scrollDepth.current = Math.max(scrollDepth.current, Math.min(100, pct));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page views and update duration on navigation
  useEffect(() => {
    if (!sessionId) return;

    const prevVisitaId = currentVisitaId.current;

    // Finalize previous page before tracking the new one
    if (prevVisitaId) {
      updateVisitaDuracionFn({
        data: {
          visitaId: prevVisitaId,
          durationMs: Date.now() - pageStartTime.current,
          scrollDepthPct: scrollDepth.current,
        },
      });
    }

    // Reset per-page state
    pageStartTime.current = Date.now();
    scrollDepth.current = 0;
    currentVisitaId.current = null;

    trackVisitaFn({
      data: {
        sessionId,
        pathname: location.pathname,
        title: document.title || null,
      },
    }).then(({ visitaId }) => {
      currentVisitaId.current = visitaId;
    });
  }, [location.pathname, sessionId]);

  // Finalize current page when tab is hidden or closed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentVisitaId.current) {
        updateVisitaDuracionFn({
          data: {
            visitaId: currentVisitaId.current,
            durationMs: Date.now() - pageStartTime.current,
            scrollDepthPct: scrollDepth.current,
          },
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return <AnalyticsContext.Provider value={{ sessionId }}>{children}</AnalyticsContext.Provider>;
}
