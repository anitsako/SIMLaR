import { createFileRoute } from '@tanstack/react-router';
import {
  Database,
  ExternalLink,
  Eye,
  Layers,
  Map,
  Network,
} from 'lucide-react';
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
    titulo: 'Centralización de información',
    descripcion:
      'Integrar y organizar información minera provincial en una plataforma digital unificada.',
  },
  {
    icon: Map,
    titulo: 'Información geoespacial',
    descripcion:
      'Facilitar el acceso a datos geográficos y técnicos sobre proyectos mineros y áreas de interés geológico.',
  },
  {
    icon: Eye,
    titulo: 'Transparencia y acceso público',
    descripcion:
      'Promover el acceso a información actualizada sobre el desarrollo del sector minero en la provincia.',
  },
  {
    icon: Layers,
    titulo: 'Planificación territorial',
    descripcion:
      'Apoyar la planificación y gestión del territorio mediante herramientas de visualización geoespacial.',
  },
  {
    icon: Network,
    titulo: 'Articulación institucional',
    descripcion:
      'Fortalecer la vinculación entre organismos públicos, empresas estatales y actores del sector minero.',
  },
];

function RouteComponent() {
  return (
    <div className="mt-4 space-y-10">
      <section className="space-y-6">
        <SectionTitle title="Objetivos provinciales" />

        <a
          href={PLAN_QUINQUENAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir el Plan Quinquenal para el Desarrollo Minero 2026–2030"
          className="group block overflow-hidden rounded-xl border shadow-sm transition hover:shadow-lg"
        >
          <img
            src={PLAN_QUINQUENAL_IMAGE}
            alt="Plan Quinquenal para el Desarrollo Minero de La Rioja 2026–2030"
            className="h-auto w-full transition duration-300 group-hover:scale-[1.01]"
          />
        </a>

        <div className="rounded-xl border p-6 sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Política minera provincial
          </p>

          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            Plan Quinquenal para el Desarrollo Minero 2026–2030
          </h2>

          <p className="mt-4 leading-relaxed text-black/70">
            El Plan Quinquenal para el Desarrollo Minero establece la hoja de
            ruta de la política minera de La Rioja para el período 2026–2030.
            Su propósito es transformar el potencial geológico y humano de la
            provincia en desarrollo productivo, empleo, inversión y
            oportunidades para las comunidades riojanas.
          </p>

          <p className="mt-3 leading-relaxed text-black/70">
            El Plan impulsa una minería moderna, sostenible, transparente,
            inclusiva y con identidad provincial. Para alcanzar estos
            objetivos, articula políticas públicas, inversión, educación,
            participación ciudadana, innovación tecnológica, cuidado ambiental
            y fortalecimiento institucional.
          </p>

          <p className="mt-3 leading-relaxed text-black/70">
            Su hoja de ruta se organiza en cinco ejes estratégicos:
            modernización institucional y normativa; educación, empleo y
            territorio; ambiente y comunidad; inversión y economía local; y
            comunicación minera.
          </p>

          <a
            href={PLAN_QUINQUENAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Consultar el Plan Quinquenal
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className='space-y-6'>
        <SectionTitle title="Misión" />
        <p className="text-lg text-black/70 leading-relaxed text-black/60">
          Promover, regular y controlar la actividad minera en La Rioja para que se desarrolle de manera responsable, sostenible y transparente, y que se traduzca en empleo, oportunidades y bienestar para las y los riojanos. Lo hacemos en articulación con las comunidades, los municipios, el sector productivo y el sistema educativo y científico, fortaleciendo una minería integrada al desarrollo territorial y productivo de la provincia.
        </p>

      </section>

      <section className="space-y-6">
        <SectionTitle title="Objetivos del sistema" />

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
                  {objetivo.titulo}
                </p>

                <p className="text-sm leading-relaxed text-black/60">
                  {objetivo.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
