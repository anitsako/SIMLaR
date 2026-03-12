import { Alert, Button, Card, CardBody } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardList, Construction, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/servicios/')({
  component: RouteComponent,
})

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
    <div className="mb-4 flex items-start justify-between gap-6 border-b border-primary/50 pb-2">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-black/60">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

function RouteComponent() {
  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-8">
        <section>
          <div className="mb-4 border-b border-primary/50 pb-3">
            <h1 className="text-3xl font-bold md:text-4xl">Servicios</h1>
            <p className="text-sm text-black/60">
              Accesos y herramientas digitales para el sector
            </p>
          </div>
        </section>

        <section>
          <SectionHeader
            title="Registro de proveedores"
            subtitle="Accedé al portal oficial de Proveedores Mineros de La Rioja"
            right={
              <a
                href="https://proveedoresmineros.larioja.gob.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Ir al portal <ExternalLink className="h-4 w-4" />
              </a>
            }
          />

          <Card className="rounded-none border shadow-sm">
            <CardBody className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <ClipboardList className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      Portal de Proveedores Mineros
                    </p>
                    <p className="mt-1 text-sm text-black/60">
                      Realizá el registro y gestioná la información vinculada a
                      proveedores del sector minero en la provincia.
                    </p>
                  </div>
                </div>

                <a
                  href="https://proveedoresmineros.larioja.gob.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    color="danger"
                    variant="solid"
                    startContent={<ExternalLink className="h-4 w-4" />}
                  >
                    Abrir portal
                  </Button>
                </a>
              </div>
            </CardBody>
          </Card>
        </section>

        <section>
          <SectionHeader
            title="Trámites digitales"
            subtitle="Gestión de trámites (módulo en preparación)"
          />
          <div className="mt-4">
            <Alert icon={<Construction />} color="warning">
              En construcción
            </Alert>
          </div>
        </section>
      </div>
    </main>
  )
}