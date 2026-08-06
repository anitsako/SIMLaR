import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router';

// import { FeaturedNews } from '../noticias/noticias-destacadas';
import { Carrousel } from '@/carrousel-imagenes/carrousel';
import { MapaPrincipal } from '@/mapa-principal/mapa-principal';
import { SectionHeader } from '@/common/section-header';
import { AccesosRapidos } from '@/common/accesos-rapidos';

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
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Visor de proyectos"
            subtitle="Explorá nuestros proyectos en un entorno interactivo"
            rightSlot={
              <Link to="/proyectos-mineros" className="text-sm font-medium text-primary hover:underline">
                Abrir proyectos mineros
              </Link>
            }
          />
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
        <AccesosRapidos />
      </section>
    </div>
  );
}
