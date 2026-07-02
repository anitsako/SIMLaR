import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Encapsulamos el parchado dentro de una función autoejecutable
// para que no contamine el ámbito global del servidor de TanStack
(() => {
  if (typeof globalThis.__dirname === 'undefined') {
    try {
      const __filename = fileURLToPath(import.meta.url);
      globalThis.__dirname = path.dirname(__filename);
    } catch (e) {
      // Silenciar en entornos donde no sea necesario
    }
  }
})();

// Hacemos un import dinámico en tiempo de ejecución solo cuando se requiera
export async function getGoogleAnalyticsClient() {
  const { BetaAnalyticsDataClient } = await import('@google-analytics/data');

  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail) {
    console.error('Missing GA_CLIENT_EMAIL');
    return null;
  }

  if (!privateKey) {
    console.error('Missing GA_PRIVATE_KEY');
    return null;
  }

  return new BetaAnalyticsDataClient({ credentials: { client_email: clientEmail, private_key: privateKey } });
}
