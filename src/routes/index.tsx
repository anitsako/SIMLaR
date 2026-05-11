import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router';

// import { FeaturedNews } from '../noticias/noticias-destacadas';
import { Carrousel } from '@/carrousel-imagenes/carrousel';
import { MapaPrincipal } from '@/mapa-principal/mapa-principal';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col p-1 md:p-2 gap-4">
      {/* Carrousel */}
      <section>
        <Carrousel />
      </section>

      {/* Visor */}
      <section>
        <div className="mb-4 flex items-center justify-between border-b border-primary/50 pb-2">
          <SectionTitle
            title="Visor de proyectos"
            subtitle="Explorá nuestros proyectos en un entorno interactivo"
            sizeTitle="lg"
            sizeSubtitle="sm"
            fontSemiBold={true}
          />

          <Link to="/proyectos-mineros" className="text-sm font-medium text-primary hover:underline">
            Abrir proyectos mineros
          </Link>
        </div>

        <ClientOnly>
          <MapaPrincipal />
        </ClientOnly>
      </section>

      {/* Noticias */}
      {/*
      <section>
        <div className="mb-4 border-b border-primary/50 pb-2">
          <h2 className="text-lg font-semibold">Noticias destacadas</h2>
          <p className="text-sm text-black/60">Selección editorial y últimas noticias</p>
        </div>

        <FeaturedNews />
      </section>
      */}

      {/* Accesos rápidos */}
      <section>
        <div className="mb-4 border-b border-primary/50 pb-2">
          <SectionTitle
            title="Accesos rápidos"
            subtitle="Organismos y sitios vinculados"
            sizeTitle="lg"
            sizeSubtitle="sm"
            fontSemiBold={true}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <a
            href="https://emse.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-24 items-center justify-center transition hover:opacity-80"
          >
            <img src="/accesos/emse.png" alt="EMSE" className="max-h-14 w-auto object-contain" />
          </a>

          <a
            href="https://kallpaenergia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-24 items-center justify-center transition hover:opacity-80"
          >
            <img src="/accesos/kallpa.png" alt="Kallpa" className="max-h-14 w-auto object-contain" />
          </a>

          <a
            href="https://www.facebook.com/minerialr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-24 items-center justify-center transition hover:opacity-80"
          >
            <img src="/accesos/mineria.jpg" alt="Secretaría de Minería" className="max-h-14 w-auto object-contain" />
          </a>
        </div>
      </section>
    </div>
  );
}
