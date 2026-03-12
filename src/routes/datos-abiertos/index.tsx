import { Alert } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { Construction } from 'lucide-react'

export const Route = createFileRoute('/datos-abiertos/')({
  component: RouteComponent,
})

const sections = [
  'Información minera general',
  'Sección de aprendizaje',
  'Datasets mineros',
  'Estadísticas del sector',
  'Informes técnicos consolidados',
  'Producción minera',
]

function RouteComponent() {
  return (
    <div className="max-w-6xl w-full mt-4 space-y-6">
      <p className="text-5xl font-bold text-center">Datos abiertos</p>

      {sections.map((title) => (
        <div key={title}>
          <p className="text-3xl font-bold mt-4">{title}</p>

          <Alert icon={<Construction />} color="warning">
            En construcción
          </Alert>
        </div>
      ))}
    </div>
  )
}