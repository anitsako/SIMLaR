import { Alert } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { Construction } from 'lucide-react'

export const Route = createFileRoute('/transparencia/')({
  component: RouteComponent,
})

const SECCIONES: Array<string> = [
  'Acceso a la información pública',
  'Marco normativo',
  'Convenios',
]

function RouteComponent() {
  return (
    <div className="mt-4 w-full max-w-6xl space-y-6">
      <p className="text-center text-5xl font-bold">Transparencia</p>

      {SECCIONES.map((titulo) => (
        <div key={titulo}>
          <p className="mt-4 text-3xl font-bold">{titulo}</p>

          <Alert icon={<Construction />} color="warning">
            En construcción
          </Alert>
        </div>
      ))}
    </div>
  )
}