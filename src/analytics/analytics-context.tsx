import { createContext, useContext } from 'react';

type AnalyticsContextValue = {
  sessionId: string | null;
};

export const AnalyticsContext = createContext<AnalyticsContextValue>({
  sessionId: null,
});

export function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}
