import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Spinner,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import {
  getLatestFromRssDirect,
  type LatestRssItem,
} from './rss/-get-latest-from-rss-direct';

function formatDate(d?: string | Date | null) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function FeaturedNews() {
  // 1) Destacadas (curadas): links a medios/redes externos.
  const featured: Array<{
    title: string;
    url: string;
    source: string;
    date?: string;
    summary?: string;
    imageUrl?: string;
  }> = [
    {
      title: 'SaltaMining — Novedades del sector (selección editorial)',
      url: 'https://saltamining.com/',
      source: 'SaltaMining',
      summary: 'Portal de noticias mineras con foco regional.',
    },
    {
      title: 'Panorama Minero — Actualidad minera y economía',
      url: 'https://www.panorama-minero.com/es',
      source: 'Panorama Minero',
      summary: 'Cobertura del sector, entrevistas y análisis.',
    },
    {
      title: 'Rumbo Minero — Noticias y tendencias',
      url: 'https://www.rumbominero.com/',
      source: 'Rumbo Minero',
      summary: 'Actualidad del sector minero en la región.',
    },
  ];

  // 2) Últimas: RSS (Minería & Desarrollo).
  const rssQuery = useQuery({
    queryKey: ['news', 'rss', { feed: 'mineriaydesarrollo', limit: 6 }],
    queryFn: () =>
      getLatestFromRssDirect({
        data: {
          limit: 6,
          feedUrl: 'https://www.mineriaydesarrollo.com/rss/noticias/',
        },
      }),
  });

  const rssItems: LatestRssItem[] = rssQuery.data ?? [];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Noticias destacadas</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            startContent={<RefreshCcw size={16} />}
            isLoading={rssQuery.isFetching}
            onPress={() => void rssQuery.refetch()}
          >
            Actualizar ahora
          </Button>
          <Button as={Link} to="/noticias" color="primary">
            Ver todas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Destacadas curadas */}
        <div>
          <h3 className="text-lg font-semibold">Selección editorial</h3>
          <div className="grid grid-cols-1 gap-4 mt-3">
            {featured.map((n) => (
              <Card key={n.url} className="h-full">
                <CardHeader className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip size="sm" variant="flat">
                      {n.source}
                    </Chip>
                    {n.date ? (
                      <span className="text-xs opacity-70">
                        {formatDate(n.date)}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-semibold leading-snug">{n.title}</p>
                </CardHeader>
                <CardBody className="pt-0">
                  {n.imageUrl ? (
                    <img
                      src={n.imageUrl}
                      alt=""
                      className="w-full h-40 object-cover rounded-xl"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  {n.summary ? (
                    <p className="text-sm opacity-80 mt-3">{n.summary}</p>
                  ) : null}
                </CardBody>
                <CardFooter className="justify-end">
                  <Button
                    as="a"
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    endContent={<ExternalLink size={16} />}
                    variant="flat"
                  >
                    Abrir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* RSS */}
        <div>
          <h3 className="text-lg font-semibold">Últimas (Minería &amp; Desarrollo)</h3>
          {rssQuery.isLoading ? (
            <div className="mt-3 flex items-center gap-3">
              <Spinner size="sm" />
              <span>Cargando RSS…</span>
            </div>
          ) : rssItems.length === 0 ? (
            <Card className="mt-3">
              <CardBody>
                <p>No se pudieron cargar noticias desde RSS.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-3">
              {rssItems.map((n) => (
                <Card key={n.url} className="h-full">
                  <CardHeader className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip size="sm" variant="flat">
                        Minería &amp; Desarrollo
                      </Chip>
                      {n.publishedAt ? (
                        <span className="text-xs opacity-70">
                          {formatDate(n.publishedAt)}
                        </span>
                      ) : null}
                    </div>
                    <p className="font-semibold leading-snug">{n.title}</p>
                  </CardHeader>
                  <CardBody className="pt-0">
                    {n.imageUrl ? (
                      <img
                        src={n.imageUrl}
                        alt=""
                        className="w-full h-40 object-cover rounded-xl"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    {n.summary ? (
                      <p className="text-sm opacity-80 mt-3">{n.summary}</p>
                    ) : null}
                  </CardBody>
                  <CardFooter className="justify-end">
                    <Button
                      as="a"
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      endContent={<ExternalLink size={16} />}
                      variant="flat"
                    >
                      Abrir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
