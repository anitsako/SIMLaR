import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router';

import { FeaturedNews } from '../noticias/noticias-destacadas';
import { Carrousel } from '@/carrousel-imagenes/carrousel';
import { MapaPrincipal } from '@/mapa-principal/mapa-principal';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-8">
        {/* Carrousel */}
        <section>
          <div className="h-60 overflow-hidden md:h-100">
            <Carrousel />
          </div>
        </section>

        {/* Visor */}
        <section>
          <div className="mb-4 flex items-start justify-between border-b border-primary/50 pb-2">
            <div>
              <h2 className="text-lg font-semibold">Visor de proyectos</h2>
              <p className="text-sm text-black/60">Explorá nuestros proyectos en un entorno interactivo</p>
            </div>

            <Link to="/proyectos-mineros" className="text-sm font-medium text-primary hover:underline">
              Abrir proyectos mineros
            </Link>
          </div>

          <ClientOnly>
            <MapaPrincipal />
          </ClientOnly>
        </section>

        {/* Noticias */}
        <section>
          <div className="mb-4 border-b border-primary/50 pb-2">
            <h2 className="text-lg font-semibold">Noticias destacadas</h2>
            <p className="text-sm text-black/60">Selección editorial y últimas noticias</p>
          </div>

          <FeaturedNews />
        </section>

        {/* Accesos rápidos */}
        <section>
          <div className="mb-4 border-b border-primary/50 pb-2">
            <h2 className="text-lg font-semibold">Accesos rápidos</h2>
            <p className="text-sm text-black/60">Organismos y sitios vinculados</p>
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
    </main>
  );
}

