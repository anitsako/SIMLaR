import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { getLatestFromSources } from './rss/noticias-rss';
import { NUEVAS_FUENTES } from './rss/nuevas-fuentes';
import type { LatestNewsItem } from './rss/noticias-rss';

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
  const { t } = useTranslation();
  const featured: Array<{
    title: string;
    url: string;
    source: string;
    date?: string;
    summary?: string;
    imageUrl?: string;
  }> = [
    {
      title: 'routes.inicio.noticias.destacadas.emse.titulo',
      url: 'https://emse.ar/blog/',
      source: 'EMSE',
      summary: 'routes.inicio.noticias.destacadas.emse.resumen',
    },
    {
      title: 'routes.inicio.noticias.destacadas.saltaMining.titulo',
      url: 'https://saltamining.com/',
      source: 'SaltaMining',
      summary: 'routes.inicio.noticias.destacadas.saltaMining.resumen',
    },
    {
      title: 'routes.inicio.noticias.destacadas.panoramaMinero.titulo',
      url: 'https://www.panorama-minero.com/es',
      source: 'Panorama Minero',
      summary: 'routes.inicio.noticias.destacadas.panoramaMinero.resumen',
    },
    {
      title: 'routes.inicio.noticias.destacadas.rumboMinero.titulo',
      url: 'https://www.rumbominero.com/',
      source: 'Rumbo Minero',
      summary: 'routes.inicio.noticias.destacadas.rumboMinero.resumen',
    },
  ];

  const rssQuery = useQuery<Array<LatestNewsItem>>({
    queryKey: ['news', 'multi', { limit: 3 }],
    queryFn: () =>
      getLatestFromSources({
        data: {
          limit: 3,
          perSource: 2,
          sources: NUEVAS_FUENTES,
        },
      }) as any,
  });

  const items: Array<LatestNewsItem> = (rssQuery.data ?? []) as any;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            startContent={<RefreshCcw size={16} />}
            isLoading={rssQuery.isFetching}
            onPress={() => void rssQuery.refetch()}
          >
            {t('routes.inicio.noticias.actualizar')}
          </Button>

          <Button as={Link} to="/noticias" color="primary">
            {t('routes.inicio.noticias.verTodas')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div>
          <h3 className="text-lg font-semibold">{t('routes.inicio.noticias.seleccionEditorial')}</h3>

          <div className="grid grid-cols-1 gap-4 mt-3">
            {featured.map((n) => (
              <Card key={n.url} className="h-full">
                <CardHeader className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip size="sm" variant="flat">
                      {n.source}
                    </Chip>
                    {n.date ? <span className="text-xs opacity-70">{formatDate(n.date)}</span> : null}
                  </div>
                  <p className="font-semibold leading-snug">{t(n.title)}</p>
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

                  {n.summary ? <p className="text-sm opacity-80 mt-3">{t(n.summary)}</p> : null}
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
                    {t('routes.inicio.noticias.abrir')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('routes.inicio.noticias.ultimasNoticias')}</h3>

          {rssQuery.isLoading ? (
            <div className="mt-3 flex items-center gap-3">
              <Spinner size="sm" />
              <span>{t('routes.inicio.noticias.cargandoFuentes')}</span>
            </div>
          ) : items.length === 0 ? (
            <Card className="mt-3">
              <CardBody>
                <p>{t('routes.inicio.noticias.errorFuentes')}</p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 mt-3">
              {items.map((n) => (
                <Card key={`${n.source ?? 'src'}-${n.url}`} className="h-full">
                  <CardHeader className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip size="sm" variant="flat">
                        {n.source ?? t('routes.inicio.noticias.fuentePorDefecto')}
                      </Chip>
                      {n.publishedAt ? <span className="text-xs opacity-70">{formatDate(n.publishedAt)}</span> : null}
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

                    {n.summary ? <p className="text-sm opacity-80 mt-3">{n.summary}</p> : null}
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
                      {t('routes.inicio.noticias.abrir')}
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
