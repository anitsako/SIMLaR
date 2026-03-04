import { Button, Card, CardBody, Chip, Divider, Spinner } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, RefreshCcw } from 'lucide-react'

import { NUEVAS_FUENTES } from './rss/nuevas-fuentes'

import { getLatestFromSources } from './rss/noticias-rss'
import type { LatestNewsItem } from './rss/noticias-rss'

export const Route = createFileRoute('/noticias/')({
  component: RouteComponent,
})

function RouteComponent() {
  const rssQuery = useQuery<Array<LatestNewsItem>>({
    queryKey: ['news', 'multi', { limit: 20 }],
    queryFn: () =>
      getLatestFromSources({
        data: {
          limit: 20,
          perSource: 8,
          sources: NUEVAS_FUENTES,
        },
      }) as any,
  })

  const items: Array<LatestNewsItem> = (rssQuery.data ?? []) as any
  const top: LatestNewsItem | undefined = items.at(0)
  const rest: Array<LatestNewsItem> = items.slice(1)

  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-5xl font-bold">Noticias</p>
            <p className="text-sm opacity-80 mt-2">
              Últimas noticias desde múltiples portales.
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
              <p>No se pudieron cargar noticias desde las fuentes configuradas.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {/* NOTICIA PRINCIPAL */}
            {top && (
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
                      {top.source ?? 'Noticias'}
                    </Chip>
                    {top.publishedAt ? (
                      <span className="text-xs opacity-70">
                        {new Date(top.publishedAt).toLocaleString('es-AR')}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-2xl md:text-3xl font-bold leading-tight">{top.title}</p>

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
            )}

            {/* RESTO EN GRILLA */}
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
              {rest.map((n) => (
                <Card
                  key={`${n.source ?? 'src'}-${n.url}`}
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
                        {n.source ?? 'Noticias'}
                      </Chip>
                      {n.publishedAt ? (
                        <span className="text-xs opacity-70">
                          {new Date(n.publishedAt).toLocaleDateString('es-AR')}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-lg font-semibold leading-snug line-clamp-2">{n.title}</p>

                    {n.summary ? (
                      <p className="text-sm opacity-80 line-clamp-3">{n.summary}</p>
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
  )
}

export default RouteComponent