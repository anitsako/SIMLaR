import { ClientOnly, createFileRoute } from '@tanstack/react-router'

import { FeaturedNews } from './noticias/noticias-destacadas'
import { Carrousel } from '@/carrousel-imagenes/carrousel'
import { MapaPrincipal } from '@/mapa-principal/mapa-principal'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-12">

        {/* Carrousel */}
        <section>
          <div className="h-60 md:h-80 overflow-hidden">
            <Carrousel />
          </div>
        </section>

        {/* Visor */}
        <section>
          <div className="border-b border-[#E62138]/50 pb-2 mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Visor de proyectos</h2>
              <p className="text-sm text-black/60">
                Explorá nuestros proyectos en un entorno interactivo
              </p>
            </div>

            <a
              href="/proyectos-mineros"
              className="text-sm font-medium text-[#E62138] hover:underline"
            >
              Abrir proyectos mineros
            </a>
          </div>

          <div className="relative h-90 md:h-130 overflow-hidden">
            <ClientOnly>
              <MapaPrincipal />
            </ClientOnly>
          </div>
        </section>

        {/* Noticias */}
        <section>
          <div className="border-b border-[#E62138]/50 pb-2 mb-4">
            <h2 className="text-lg font-semibold">Noticias destacadas</h2>
            <p className="text-sm text-black/60">
              Selección editorial y últimas noticias
            </p>
          </div>

          <FeaturedNews />
        </section>

        {/* Accesos rápidos */}
        <section>
          <div className="border-b border-[#E62138]/50 pb-2 mb-4">
            <h2 className="text-lg font-semibold">Accesos rápidos</h2>
            <p className="text-sm text-black/60">
              Organismos y sitios vinculados
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href="https://emse.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-24 hover:opacity-80 transition"
            >
              <img
                src="/accesos/emse.png"
                alt="EMSE"
                className="max-h-14 w-auto object-contain"
              />
            </a>

            <a
              href="https://kallpaenergia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-24 hover:opacity-80 transition"
            >
              <img
                src="/accesos/kallpa.png"
                alt="Kallpa"
                className="max-h-14 w-auto object-contain"
              />
            </a>

            <a
              href="https://www.facebook.com/minerialr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-24 hover:opacity-80 transition"
            >
              <img
                src="/accesos/mineria.jpg"
                alt="Secretaría de Minería"
                className="max-h-14 w-auto object-contain"
              />
            </a>
          </div>
        </section>

      </div>
    </main>
  )
}