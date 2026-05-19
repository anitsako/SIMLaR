import { createFileRoute } from '@tanstack/react-router';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';
import SectionTitle from '@/common/sectionTitle';

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
        <img
          src={item.foto}
          alt={item.nombre}
          className="w-full h-85 object-cover"
        />
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

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
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
            title="Autoridades"
            subtitle="Información de autoridades y organismos vinculados"
            sizeTitle="3xl"
            sizeSubtitle="md"
            responsiveMd
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Autoridades"
          subtitle="Gobierno provincial, áreas vinculadas y empresas estatales"
        />

        <div className="space-y-14">
          {SECCIONES_AUTORIDADES.map((seccion) => (
            <div key={seccion.titulo}>
              <p
                className={`mb-4 text-sm font-medium text-black/60 ${
                  seccion.centered ? 'text-center' : ''
                }`}
              >
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
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Accesos rápidos"
          subtitle="Organismos y sitios vinculados"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ACCESOS_RAPIDOS.map((acceso) => (
            <a
              key={acceso.href}
              href={acceso.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-24 items-center justify-center transition hover:opacity-80"
            >
              <img
                src={acceso.src}
                alt={acceso.alt}
                className="max-h-14 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}