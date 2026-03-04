import { createFileRoute } from '@tanstack/react-router'
import {
  Database,
  Eye,
  Facebook,
  Instagram,
  Layers,
  Map,
  Network,
  Twitter,
} from 'lucide-react'
import { Card, CardBody } from '@heroui/react'

export const Route = createFileRoute('/institucional/')({
  component: RouteComponent,
})

type Autoridad = {
  nombre: string
  cargo: string
  foto: string
  redes?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

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
    foto: '/autoridades/sec-amb.png',
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
]

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
        <div className="bg-[#606062] text-white px-6 py-6">
          <p className="text-center text-2xl tracking-wide">{item.nombre}</p>

          <div className="my-4 h-px w-full bg-white/40" />

          <p className="text-center text-lg font-semibold">{item.cargo}</p>

          <div className="mt-5 flex items-center justify-center gap-4">
            {item.redes?.facebook && (
              <a
                href={item.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white text-[#606062] p-2 hover:opacity-80 transition"
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
                className="rounded-full bg-white text-[#606062] p-2 hover:opacity-80 transition"
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
                className="rounded-full bg-white text-[#606062] p-2 hover:opacity-80 transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <div className="border-b border-[#E62138]/50 pb-2 mb-4 flex items-start justify-between gap-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-black/60">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

function RouteComponent() {
  const gobernador = AUTORIDADES[0]
  const vice = AUTORIDADES[1]
  const gabinete = AUTORIDADES[2]
  const ministro = AUTORIDADES[3]
  const secretarios = AUTORIDADES.slice(4, 7)
  const presidentes = AUTORIDADES.slice(7, 9)

  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-12">
        {/* Título */}
        <section>
          <div className="border-b border-[#E62138]/50 pb-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">Institucional</h1>
            <p className="text-sm text-black/60">
              Autoridades, objetivos y organismos vinculados
            </p>
          </div>
        </section>

        {/* Autoridades */}
        <section>
          <SectionHeader
            title="Autoridades"
            subtitle="Gobierno provincial, áreas vinculadas y empresas estatales"
          />

          <div className="space-y-14">
            {/* Gobernador */}
            <div>
              <p className="text-sm font-medium text-black/60 mb-4 text-center">
                Gobernación
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <AutoridadCard item={gobernador} />
                </div>
              </div>
            </div>

            {/* Vice */}
            <div>
              <p className="text-sm font-medium text-black/60 mb-4 text-center">
                Vicegobernación
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <AutoridadCard item={vice} />
                </div>
              </div>
            </div>

            {/* Gabinete */}
            <div>
              <p className="text-sm font-medium text-black/60 mb-4 text-center">
                Gabinete
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <AutoridadCard item={gabinete} />
                </div>
              </div>
            </div>

            {/* Ministro */}
            <div>
              <p className="text-sm font-medium text-black/60 mb-4 text-center">
                Ministerio
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <AutoridadCard item={ministro} />
                </div>
              </div>
            </div>

            {/* Secretarios */}
            <div>
              <p className="text-sm font-medium text-black/60 mb-4">
                Secretarías
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {secretarios.map((s) => (
                  <AutoridadCard key={s.nombre} item={s} />
                ))}
              </div>
            </div>

            {/* Empresas */}
            <div>
              <p className="text-sm font-medium text-black/60 mb-4">
                Empresas estatales
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {presidentes.map((p) => (
                  <AutoridadCard key={p.nombre} item={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Objetivos */}
        <section>
          <SectionHeader
            title="Objetivos y alcance de SIMLaR"
            subtitle="Marco general y líneas de trabajo"
          />

          <div className="mt-6 space-y-6">
            <p className="text-black/70 leading-relaxed">
              <strong>SIMLaR – Sistema de Información Minera de La Rioja</strong>{' '}
              es una plataforma digital desarrollada por mano de obra riojana
              destinada a centralizar, organizar y visualizar información
              geográfica y técnica vinculada a la actividad minera de la
              provincia.
            </p>

            <p className="text-black/70 leading-relaxed">
              A través de herramientas de visualización geoespacial, el sistema
              permite integrar distintas fuentes de información y facilitar el
              acceso a datos estratégicos para la planificación y gestión del
              sector minero.
            </p>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border rounded-lg p-6 text-center hover:shadow-md transition">
                <p className="text-4xl font-bold text-[#E62138]">+120</p>
                <p className="mt-2 text-sm text-black/60 uppercase tracking-wide">
                  Proyectos mineros
                </p>
              </div>

              <div className="border rounded-lg p-6 text-center hover:shadow-md transition">
                <p className="text-4xl font-bold text-[#E62138]">+25</p>
                <p className="mt-2 text-sm text-black/60 uppercase tracking-wide">
                  Capas geográficas
                </p>
              </div>

              <div className="border rounded-lg p-6 text-center hover:shadow-md transition">
                <p className="text-4xl font-bold text-[#E62138]">+3</p>
                <p className="mt-2 text-sm text-black/60 uppercase tracking-wide">
                  Organismos integrados
                </p>
              </div>
            </div>

            <p className="font-semibold text-lg mt-2">Objetivos del sistema</p>

            {/* Cards objetivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-5 hover:shadow-md transition">
                <Database className="h-8 w-8 text-[#E62138] mb-3" />
                <p className="font-semibold mb-1">Centralización de información</p>
                <p className="text-sm text-black/60">
                  Integrar y organizar información minera provincial en una
                  plataforma digital unificada.
                </p>
              </div>

              <div className="border rounded-lg p-5 hover:shadow-md transition">
                <Map className="h-8 w-8 text-[#E62138] mb-3" />
                <p className="font-semibold mb-1">Información geoespacial</p>
                <p className="text-sm text-black/60">
                  Facilitar el acceso a datos geográficos y técnicos sobre
                  proyectos mineros y áreas de interés geológico.
                </p>
              </div>

              <div className="border rounded-lg p-5 hover:shadow-md transition">
                <Eye className="h-8 w-8 text-[#E62138] mb-3" />
                <p className="font-semibold mb-1">Transparencia y acceso público</p>
                <p className="text-sm text-black/60">
                  Promover el acceso a información actualizada sobre el
                  desarrollo del sector minero en la provincia.
                </p>
              </div>

              <div className="border rounded-lg p-5 hover:shadow-md transition">
                <Layers className="h-8 w-8 text-[#E62138] mb-3" />
                <p className="font-semibold mb-1">Planificación territorial</p>
                <p className="text-sm text-black/60">
                  Apoyar la planificación y gestión del territorio mediante
                  herramientas de visualización geoespacial.
                </p>
              </div>

              <div className="border rounded-lg p-5 hover:shadow-md transition">
                <Network className="h-8 w-8 text-[#E62138] mb-3" />
                <p className="font-semibold mb-1">Articulación institucional</p>
                <p className="text-sm text-black/60">
                  Fortalecer la vinculación entre organismos públicos, empresas
                  estatales y actores del sector minero.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section>
          <SectionHeader
            title="Accesos rápidos"
            subtitle="Organismos y sitios vinculados"
          />

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