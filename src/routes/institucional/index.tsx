import { createFileRoute } from '@tanstack/react-router';
import { Database, Eye, Facebook, Instagram, Layers, Map, Network, Twitter } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';

export const Route = createFileRoute('/institucional/')({
  component: RouteComponent,
});

type Autoridad = {
  nombre: string;
  cargo: string;
  foto: string;
  redes?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
};

type SeccionAutoridades = {
  titulo: string;
  items: Array<Autoridad>;
  columns: string;
  centered: boolean;
  itemWrapper?: string;
};

type Metrica = {
  valor: string;
  label: string;
};

type Objetivo = {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  descripcion: string;
};

type AccesoRapido = {
  href: string;
  alt: string;
  src: string;
};

const AUTORIDADES: Array<Autoridad> = [
  {
    nombre: 'RICARDO QUINTELA',
    cargo: 'Gobernador de La Rioja',
    foto: '/autoridades/gobernador.jpg',
  },
  {
    nombre: 'TERESITA MADERA',
    cargo: 'Vice Gobernadora de La Rioja',
    foto: '/autoridades/vicegob.jpg',
  },
  {
    nombre: 'JUAN LUNA CORZO',
    cargo: 'Jefe de Gabinete de Ministros',
    foto: '/autoridades/gabinete.jpg',
  },
  {
    nombre: 'FEDERICO BAZAN',
    cargo: 'Ministro de Trabajo, Empleo, Industria y Minería',
    foto: '/autoridades/ministro.jpg',
  },
  {
    nombre: 'LUZ SANTANGELO',
    cargo: 'Secretaria de Comunicación y Planificación Pública',
    foto: '/autoridades/sec-com.jpg',
  },
  {
    nombre: 'IVANA GUARDIA',
    cargo: 'Secretaria Mineria',
    foto: '/autoridades/sec-min.jpg',
  },
  {
    nombre: 'SANTIAGO AZULAY',
    cargo: 'Secretario de Ambiente',
    foto: '/autoridades/sec-amb.jpg',
  },
  {
    nombre: 'WALTER GOMEZ',
    cargo: 'Presidente de EMSE S.E',
    foto: '/autoridades/emse.jpg',
  },
  {
    nombre: 'ARIEL PARMEGIANI',
    cargo: 'Presidente de KALLPA',
    foto: '/autoridades/kalpa.jpg',
  },
];

const SECCIONES_AUTORIDADES: Array<SeccionAutoridades> = [
  {
    titulo: 'Gobernación',
    items: AUTORIDADES.slice(0, 1),
    columns: 'flex justify-center',
    itemWrapper: 'w-full max-w-sm',
    centered: true,
  },
  {
    titulo: 'Vicegobernación',
    items: AUTORIDADES.slice(1, 2),
    columns: 'flex justify-center',
    itemWrapper: 'w-full max-w-sm',
    centered: true,
  },
  {
    titulo: 'Gabinete',
    items: AUTORIDADES.slice(2, 3),
    columns: 'flex justify-center',
    itemWrapper: 'w-full max-w-sm',
    centered: true,
  },
  {
    titulo: 'Ministerio',
    items: AUTORIDADES.slice(3, 4),
    columns: 'flex justify-center',
    itemWrapper: 'w-full max-w-sm',
    centered: true,
  },
  {
    titulo: 'Secretarías',
    items: AUTORIDADES.slice(4, 7),
    columns: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
    centered: false,
  },
  {
    titulo: 'Empresas estatales',
    items: AUTORIDADES.slice(7, 9),
    columns: 'grid grid-cols-1 sm:grid-cols-2 gap-8',
    centered: false,
  },
];

const METRICAS: Array<Metrica> = [
  { valor: '+120', label: 'Proyectos mineros' },
  { valor: '+25', label: 'Capas geográficas' },
  { valor: '+3', label: 'Organismos integrados' },
];

const OBJETIVOS: Array<Objetivo> = [
  {
    icon: Database,
    titulo: 'Centralización de información',
    descripcion: 'Integrar y organizar información minera provincial en una plataforma digital unificada.',
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
    descripcion: 'Promover el acceso a información actualizada sobre el desarrollo del sector minero en la provincia.',
  },
  {
    icon: Layers,
    titulo: 'Planificación territorial',
    descripcion: 'Apoyar la planificación y gestión del territorio mediante herramientas de visualización geoespacial.',
  },
  {
    icon: Network,
    titulo: 'Articulación institucional',
    descripcion: 'Fortalecer la vinculación entre organismos públicos, empresas estatales y actores del sector minero.',
  },
];

const ACCESOS_RAPIDOS: Array<AccesoRapido> = [
  {
    href: 'https://emse.ar/',
    alt: 'EMSE',
    src: '/accesos/emse.png',
  },
  {
    href: 'https://kallpaenergia.com/',
    alt: 'Kallpa',
    src: '/accesos/kallpa.png',
  },
  {
    href: 'https://www.facebook.com/minerialr/',
    alt: 'Secretaría de Minería',
    src: '/accesos/mineria.jpg',
  },
];

function AutoridadCard({ item }: { item: Autoridad }) {
  return (
    <Card className="overflow-hidden rounded-none shadow-md">
      <div className="w-full bg-default-200">
        <img src={item.foto} alt={item.nombre} className="w-full h-85 object-cover" />
      </div>

      <CardBody className="p-0">
        <div className="bg-default-700 text-white px-6 py-6">
          <p className="text-center text-2xl tracking-wide">{item.nombre}</p>

          <div className="my-4 h-px w-full bg-white/40" />

          <p className="text-center text-lg font-semibold">{item.cargo}</p>

          <div className="mt-5 flex items-center justify-center gap-4">
            {item.redes?.facebook && (
              <a
                href={item.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white text-default-700 p-2 transition hover:opacity-80"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}

            {item.redes?.instagram && (
              <a
                href={item.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white text-default-700 p-2 transition hover:opacity-80"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}

            {item.redes?.twitter && (
              <a
                href={item.redes.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white text-default-700 p-2 transition hover:opacity-80"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
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
          <h1 className="text-3xl font-bold md:text-4xl">Institucional</h1>
          <p className="text-sm text-black/60">Autoridades, objetivos y organismos vinculados</p>
        </div>
      </section>

      <section>
        <SectionHeader title="Autoridades" subtitle="Gobierno provincial, áreas vinculadas y empresas estatales" />

        <div className="space-y-14">
          {SECCIONES_AUTORIDADES.map((seccion) => (
            <div key={seccion.titulo}>
              <p className={`mb-4 text-sm font-medium text-black/60 ${seccion.centered ? 'text-center' : ''}`}>
                {seccion.titulo}
              </p>

              <div className={seccion.columns}>
                {seccion.items.map((item) =>
                  seccion.itemWrapper ? (
                    <div key={item.nombre} className={seccion.itemWrapper}>
                      <AutoridadCard item={item} />
                    </div>
                  ) : (
                    <AutoridadCard key={item.nombre} item={item} />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Objetivos y alcance de SIMLaR" subtitle="Marco general y líneas de trabajo" />

        <div className="mt-6 space-y-6">
          <p className="leading-relaxed text-black/70">
            <strong>SIMLaR – Sistema de Información Minera de La Rioja</strong> es una plataforma digital desarrollada
            por mano de obra riojana destinada a centralizar, organizar y visualizar información geográfica y técnica
            vinculada a la actividad minera de la provincia.
          </p>

          <p className="leading-relaxed text-black/70">
            A través de herramientas de visualización geoespacial, el sistema permite integrar distintas fuentes de
            información y facilitar el acceso a datos estratégicos para la planificación y gestión del sector minero.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {METRICAS.map((metrica) => (
              <div key={metrica.label} className="rounded-lg border p-6 text-center transition hover:shadow-md">
                <p className="text-4xl font-bold text-primary">{metrica.valor}</p>
                <p className="mt-2 text-sm uppercase tracking-wide text-black/60">{metrica.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-2 text-lg font-semibold">Objetivos del sistema</p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {OBJETIVOS.map((objetivo) => {
              const Icon = objetivo.icon;

              return (
                <div key={objetivo.titulo} className="rounded-lg border p-5 transition hover:shadow-md">
                  <Icon className="mb-3 h-8 w-8 text-primary" />
                  <p className="mb-1 font-semibold">{objetivo.titulo}</p>
                  <p className="text-sm text-black/60">{objetivo.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Accesos rápidos" subtitle="Organismos y sitios vinculados" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ACCESOS_RAPIDOS.map((acceso) => (
            <a
              key={acceso.href}
              href={acceso.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-24 items-center justify-center transition hover:opacity-80"
            >
              <img src={acceso.src} alt={acceso.alt} className="max-h-14 w-auto object-contain" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
