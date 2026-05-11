import { Button, Card, CardBody, Chip, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ExternalLink, RefreshCcw } from 'lucide-react';

import { NUEVAS_FUENTES } from '../../noticias/rss/nuevas-fuentes';
import { getLatestFromSources } from '../../noticias/rss/noticias-rss';
import type { LatestNewsItem } from '../../noticias/rss/noticias-rss';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/noticias/')({
  component: RouteComponent,
});

function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="border-b border-[#E62138]/50 pb-2 mb-4 flex items-start justify-between gap-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-black/60">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

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
  });

  const items: Array<LatestNewsItem> = (rssQuery.data ?? []) as any;
  const top: LatestNewsItem | undefined = items.at(0);
  const rest: Array<LatestNewsItem> = items.slice(1);

  return (
    <div className="mt-4 space-y-6">
      {/* Título */}
      <section>
        <div className="border-b border-[#E62138]/50 pb-3 mb-4">
          <SectionTitle
            title="Noticias"
            sizeTitle="3xl"
            responsiveMd
            subtitle="Últimas noticias desde múltiples portales."
            sizeSubtitle="sm"
          />
        </div>
      </section>

      {/* Contenido */}
      <section>
        <SectionHeader
          title="Últimas noticias"
          subtitle="Selección automática desde fuentes configuradas"
          right={
            <Button
              variant="flat"
              startContent={<RefreshCcw size={16} />}
              isLoading={rssQuery.isFetching}
              onPress={() => void rssQuery.refetch()}
              className="text-[#E62138]"
            >
              Actualizar
            </Button>
          }
        />

        {rssQuery.isLoading ? (
          <div className="flex items-center gap-3 text-black/70">
            <Spinner size="sm" />
            <span>Cargando noticias…</span>
          </div>
        ) : items.length === 0 ? (
          <Card className="rounded-none border shadow-sm">
            <CardBody>
              <p className="text-black/70">No se pudieron cargar noticias desde las fuentes configuradas.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {/* NOTICIA PRINCIPAL */}
            {top && (
              <Card className="rounded-none overflow-hidden border hover:shadow-lg transition-shadow">
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

                <CardBody className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip size="sm" variant="flat">
                      {top.source ?? 'Noticias'}
                    </Chip>
                    {top.publishedAt ? (
                      <span className="text-xs text-black/60">{new Date(top.publishedAt).toLocaleString('es-AR')}</span>
                    ) : null}
                  </div>

                  <p className="text-2xl md:text-3xl font-bold leading-tight">{top.title}</p>

                  {top.summary ? (
                    <p className="text-base text-black/70 leading-relaxed line-clamp-4">{top.summary}</p>
                  ) : null}

                  <div className="mt-2">
                    <Button
                      as="a"
                      href={top.url}
                      target="_blank"
                      rel="noreferrer"
                      endContent={<ExternalLink size={16} />}
                      className="bg-[#E62138] text-white"
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
                  className="h-full rounded-none overflow-hidden border hover:shadow-lg transition-shadow"
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

                  <CardBody className="flex flex-col gap-3 p-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip size="sm" variant="flat">
                        {n.source ?? 'Noticias'}
                      </Chip>
                      {n.publishedAt ? (
                        <span className="text-xs text-black/60">
                          {new Date(n.publishedAt).toLocaleDateString('es-AR')}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-lg font-semibold leading-snug line-clamp-2">{n.title}</p>

                    {n.summary ? <p className="text-sm text-black/70 line-clamp-3">{n.summary}</p> : null}

                    <div className="mt-auto">
                      <Button
                        as="a"
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        endContent={<ExternalLink size={16} />}
                        variant="flat"
                        size="sm"
                        className="text-[#E62138]"
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
      </section>
    </div>
  );
}
