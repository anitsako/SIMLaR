import { Button, Card, CardBody, Chip, Divider, Spinner } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { getLatestFromRssDirect } from "./rss/-get-latest-from-rss-direct";


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

  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-5xl font-bold">Noticias</p>
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

      <div className="max-w-6xl w-full mt-4">
        {rssQuery.isLoading ? (
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <span>Cargando noticias…</span>
          </div>
        ) : (rssQuery.data?.length ?? 0) === 0 ? (
          <Card>
            <CardBody>
              <p>
                No se pudieron cargar noticias desde RSS.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {rssQuery.data!.map((n) => (
              <Card key={n.url}>
                <CardBody>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-[240px] flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Chip size="sm" variant="flat">
                          Minería &amp; Desarrollo
                        </Chip>
                        {n.publishedAt ? (
                          <span className="text-xs opacity-70">
                            {new Date(n.publishedAt).toLocaleString('es-AR')}
                          </span>
                        ) : null}
                      </div>
                      <p className="font-semibold mt-2">{n.title}</p>
                      {n.summary ? <p className="text-sm opacity-80 mt-2">{n.summary}</p> : null}
                    </div>

                    <div className="w-full md:w-[220px]">
                      {n.imageUrl ? (
                        <img
                          src={n.imageUrl}
                          alt=""
                          className="w-full h-32 object-cover rounded-xl"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                    </div>

                    <div className="ml-auto">
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
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
