import { createFileRoute } from '@tanstack/react-router';
import {
  Database,
  ExternalLink,
  Eye,
  Layers,
  Map,
  Network,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ComponentType } from 'react';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/objetivos/')({
  component: RouteComponent,
});

type Objetivo = {
  icon: ComponentType<{ className?: string }>;
  titulo: string;
  descripcion: string;
};

const PLAN_QUINQUENAL_URL =
  'https://larioja.gob.ar/plan-quinquenal-para-el-desarrollo-minero-2026.pdf';

const PLAN_QUINQUENAL_IMAGE =
  '/images/plan-quinquenal-minero.png';

const OBJETIVOS: Array<Objetivo> = [
  {
    icon: Database,
    titulo: 'routes.objetivos.sistema.centralizacion.titulo',
    descripcion:
      'routes.objetivos.sistema.centralizacion.descripcion',
  },
  {
    icon: Map,
    titulo: 'routes.objetivos.sistema.geoespacial.titulo',
    descripcion:
      'routes.objetivos.sistema.geoespacial.descripcion',
  },
  {
    icon: Eye,
    titulo: 'routes.objetivos.sistema.transparencia.titulo',
    descripcion:
      'routes.objetivos.sistema.transparencia.descripcion',
  },
  {
    icon: Layers,
    titulo: 'routes.objetivos.sistema.planificacion.titulo',
    descripcion:
      'routes.objetivos.sistema.planificacion.descripcion',
  },
  {
    icon: Network,
    titulo: 'routes.objetivos.sistema.articulacion.titulo',
    descripcion:
      'routes.objetivos.sistema.articulacion.descripcion',
  },
];

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="mt-4 space-y-10">
      <section className="space-y-6">
        <SectionTitle title={t('routes.objetivos.page.title')} />

        <a
          href={PLAN_QUINQUENAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('routes.objetivos.planQuinquenal.abrirAria')}
          className="group block overflow-hidden rounded-xl border shadow-sm transition hover:shadow-lg"
        >
          <img
            src={PLAN_QUINQUENAL_IMAGE}
            alt={t('routes.objetivos.planQuinquenal.imageAlt')}
            className="h-auto w-full transition duration-300 group-hover:scale-[1.01]"
          />
        </a>

        <div className="rounded-xl border p-6 sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            {t('routes.objetivos.planQuinquenal.etiqueta')}
          </p>

          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            {t('routes.objetivos.planQuinquenal.title')}
          </h2>

          <p className="mt-4 leading-relaxed text-black/70">
            {t('routes.objetivos.planQuinquenal.parrafo1')}
          </p>

          <p className="mt-3 leading-relaxed text-black/70">
            {t('routes.objetivos.planQuinquenal.parrafo2')}
          </p>

          <p className="mt-3 leading-relaxed text-black/70">
            {t('routes.objetivos.planQuinquenal.parrafo3')}
          </p>

          <a
            href={PLAN_QUINQUENAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('routes.objetivos.planQuinquenal.consultar')}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className='space-y-6'>
        <SectionTitle title={t('routes.objetivos.mision.title')} />
        <p className="text-lg text-black/70 leading-relaxed text-black/60">
          {t('routes.objetivos.mision.texto')}
        </p>

      </section>

      <section className="space-y-6">
        <SectionTitle title={t('routes.objetivos.sistema.title')} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {OBJETIVOS.map((objetivo) => {
            const Icon = objetivo.icon;

            return (
              <div
                key={objetivo.titulo}
                className="rounded-lg border p-5 transition hover:shadow-md"
              >
                <Icon className="mb-3 h-8 w-8 text-primary" />

                <p className="mb-1 font-semibold">
                  {t(objetivo.titulo)}
                </p>

                <p className="text-sm leading-relaxed text-black/60">
                  {t(objetivo.descripcion)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
