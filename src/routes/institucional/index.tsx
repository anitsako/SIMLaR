import { createFileRoute } from '@tanstack/react-router'
import { Facebook, Instagram, Twitter } from 'lucide-react'
<<<<<<< HEAD
import { Card, CardBody } from '@heroui/react'
=======

import gobernadorImg from '../../assets/autoridades/gobernador.jpg'
import ministroImg from '../../assets/autoridades/ministro.jpg'
import kalpaImg from '../../assets/autoridades/kalpa.jpg'
import secComImg from '../../assets/autoridades/sec-com.jpg'
import secMinImg from '../../assets/autoridades/sec-min.jpg'
import emseImg from '../../assets/autoridades/emse.jpg'
import viceImg from '../../assets/autoridades/vicegob.jpg'
import gabineteImg from '../../assets/autoridades/gabinete.jpg'
import secAmbImg from '../../assets/autoridades/sec-amb.png'

>>>>>>> 1605f37 (actualizacion de seccion de autoridades)

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
<<<<<<< HEAD
    foto: '/autoridades/ministro.jpg',
=======
    foto: ministroImg,
>>>>>>> 1605f37 (actualizacion de seccion de autoridades)
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
<<<<<<< HEAD
    foto: '/autoridades/sec-amb.png',
=======
    foto: secAmbImg,
>>>>>>> 1605f37 (actualizacion de seccion de autoridades)
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

function RouteComponent() {
  const gobernador = AUTORIDADES[0]
  const vice = AUTORIDADES[1]
  const gabinete = AUTORIDADES[2]
  const ministro = AUTORIDADES[3]
  const secretarios = AUTORIDADES.slice(4, 7)
  const presidentes = AUTORIDADES.slice(7, 9)

  return (
    <div className="w-full py-6">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-5xl font-bold text-center">Institucional</p>

        <div className="mt-10">
          <p className="text-3xl font-bold">Autoridades</p>

          <div className="mt-10 space-y-16">

            {/* Gobernador */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <AutoridadCard item={gobernador} />
              </div>
            </div>

            {/* Vice */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <AutoridadCard item={vice} />
              </div>
            </div>

            {/* Jefe de Gabinete */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <AutoridadCard item={gabinete} />
              </div>
            </div>

            {/* Ministro */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <AutoridadCard item={ministro} />
              </div>
            </div>

            {/* Secretarios */}
            <div>
              <p className="text-center text-xl font-semibold text-default-600 mb-6">
                Secretarios
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {secretarios.map((s) => (
                  <AutoridadCard key={s.nombre} item={s} />
                ))}
              </div>
            </div>

            {/* Presidentes */}
            <div>
              <p className="text-center text-xl font-semibold text-default-600 mb-6">
                Empresas estatales
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {presidentes.map((p) => (
                  <AutoridadCard key={p.nombre} item={p} />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-14">
          <p className="text-3xl font-bold">Objetivos y alcance de SIMLaR</p>
          <div className="mt-4 text-default-500">En construcción</div>
        </div>

        <div className="mt-14">
          <p className="text-3xl font-bold">Organismos vinculados</p>
          <div className="mt-4 text-default-500">En construcción</div>
        </div>
      </div>
    </div>
  )
}