import { Button, Card, CardBody, Chip, Divider, Spinner } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { getLatestFromRssDirect } from './rss/-get-latest-from-rss-direct';

export const Route = createFileRoute('/noticias/')({
  component: RouteComponent,
});

function RouteComponent() {
  const rssQuery = useQuery({
    queryKey: ['news', 'rss', { feed: 'mineriaydesarrollo', limit: 30 }],
    queryFn: () =>
      getLatestFromRssDirect({
        data: {
          limit: 30,
          feedUrl: 'https://www.mineriaydesarrollo.com/rss/noticias/',
        },
      }),
  });

  const items = rssQuery.data ?? [];
  const [top, ...rest] = items;

  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-5xl font-bold">Noticias</p>
            <p className="text-sm opacity-80 mt-2">
              Últimas noticias desde RSS (Minería &amp; Desarrollo).
            </p>
          </div>

          <Button
            variant="flat"
            startContent={<RefreshCcw size={16} />}
            isLoading={rssQuery.isFetching}
            onPress={() => void rssQuery.refetch()}
          >
            Actualizar ahora
          </Button>
        </div>
      </div>

      <Divider className="max-w-6xl w-full mt-4" />

      <div className="max-w-6xl w-full mt-6">
        {rssQuery.isLoading ? (
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <span>Cargando noticias…</span>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardBody>
              <p>No se pudieron cargar noticias desde RSS.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {/* NOTICIA PRINCIPAL */}
            {top ? (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {top.imageUrl ? (
                  <div className="w-full h-72 md:h-80 overflow-hidden">
                    <img
                      src={top.imageUrl}
                      alt={top.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : null}

                <CardBody className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip size="sm" variant="flat">
                      Minería &amp; Desarrollo
                    </Chip>
                    {top.publishedAt ? (
                      <span className="text-xs opacity-70">
                        {new Date(top.publishedAt).toLocaleString('es-AR')}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-2xl md:text-3xl font-bold leading-tight">
                    {top.title}
                  </p>

                  {top.summary ? (
                    <p className="text-base opacity-80 leading-relaxed line-clamp-4">
                      {top.summary}
                    </p>
                  ) : null}

                  <div className="mt-2">
                    <Button
                      as="a"
                      href={top.url}
                      target="_blank"
                      rel="noreferrer"
                      endContent={<ExternalLink size={16} />}
                      color="primary"
                    >
                      Leer nota
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : null}

            {/* RESTO EN GRILLA */}
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
              {rest.map((n) => (
                <Card
                  key={n.url}
                  className="h-full overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {n.imageUrl ? (
                    <div className="w-full h-44 overflow-hidden">
                      <img
                        src={n.imageUrl}
                        alt={n.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : null}

                  <CardBody className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip size="sm" variant="flat">
                        Minería &amp; Desarrollo
                      </Chip>
                      {n.publishedAt ? (
                        <span className="text-xs opacity-70">
                          {new Date(n.publishedAt).toLocaleDateString('es-AR')}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-lg font-semibold leading-snug line-clamp-2">
                      {n.title}
                    </p>

                    {n.summary ? (
                      <p className="text-sm opacity-80 line-clamp-3">
                        {n.summary}
                      </p>
                    ) : null}

                    <div className="mt-auto">
                      <Button
                        as="a"
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        endContent={<ExternalLink size={16} />}
                        variant="flat"
                        size="sm"
                      >
                        Leer nota
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
