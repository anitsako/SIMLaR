import { createFileRoute } from '@tanstack/react-router';
import type { ComponentType, ReactNode } from 'react';
import { Database, Eye, Layers, Map, Network } from 'lucide-react';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/objetivos/')({
  component: RouteComponent,
});

type Metrica = {
  valor: string;
  label: string;
};

type Objetivo = {
  icon: ComponentType<{ className?: string }>;
  titulo: string;
  descripcion: string;
};

const METRICAS: Array<Metrica> = [
  { valor: '+120', label: 'Proyectos mineros' },
  { valor: '+25', label: 'Capas geográficas' },
  { valor: '+3', label: 'Organismos integrados' },
];

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

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-6 border-b border-primary/50 pb-2">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-black/60">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function RouteComponent() {
  return (
    <div className="mt-4 space-y-6">
      <section>
        <div className="mb-4 border-b border-primary/50 pb-3">
          <SectionTitle
            title="Objetivos"
            subtitle="Objetivos y alcance del Sistema de Información Minera de La Rioja"
            sizeTitle="3xl"
            sizeSubtitle="md"
            responsiveMd
          />
        </div>
      </section>

      <section>
        

        <div className="mt-6 space-y-6">
          <p className="leading-relaxed text-black/70">
            <strong>SIMLaR – Sistema de Información Minera de La Rioja</strong>{' '}
            es una plataforma digital desarrollada por mano de obra riojana
            destinada a centralizar, organizar y visualizar información geográfica
            y técnica vinculada a la actividad minera de la provincia.
          </p>

          <p className="leading-relaxed text-black/70">
            A través de herramientas de visualización geoespacial, el sistema
            permite integrar distintas fuentes de información y facilitar el
            acceso a datos estratégicos para la planificación y gestión del sector
            minero.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {METRICAS.map((metrica) => (
              <div
                key={metrica.label}
                className="rounded-lg border p-6 text-center transition hover:shadow-md"
              >
                <p className="text-4xl font-bold text-primary">
                  {metrica.valor}
                </p>
                <p className="mt-2 text-sm uppercase tracking-wide text-black/60">
                  {metrica.label}
                </p>
              </div>
            ))}
          </div>

          <SectionTitle
            title="Objetivos del sistema"
            sizeTitle="lg"
            fontSemiBold={true}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {OBJETIVOS.map((objetivo) => {
              const Icon = objetivo.icon;

              return (
                <div
                  key={objetivo.titulo}
                  className="rounded-lg border p-5 transition hover:shadow-md"
                >
                  <Icon className="mb-3 h-8 w-8 text-primary" />
                  <p className="mb-1 font-semibold">{objetivo.titulo}</p>
                  <p className="text-sm text-black/60">
                    {objetivo.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}