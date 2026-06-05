import { Button, Card, CardBody } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import SectionTitle from '@/common/sectionTitle';
import Formulario from '@/form-consultas/form';
import { ContactoInstitucional } from '@/form-consultas/contacto-institucional';

export const Route = createFileRoute('/contacto/')({
  component: RouteComponent,
});

function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="border-b border-primary/50 pb-2 mb-4 flex items-start justify-between gap-6">
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
      {/* smooth scroll para anclas */}
      {/* Título */}
      <section>
        <div className="pb-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SectionTitle
              title="Contacto"
              subtitle="Información institucional y canales de comunicación"
            />
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Atención online
            </span>
          </div>

          {/* Anclas rápidas */}
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href="#contacto-institucional"
              className="text-sm px-4 py-2 border rounded-full hover:shadow-sm transition text-primary"
            >
              Contacto institucional
            </a>
            <a
              href="#ubicacion"
              className="text-sm px-4 py-2 border rounded-full hover:shadow-sm transition text-primary"
            >
              Ubicación
            </a>
            <a
              href="#formulario"
              className="text-sm px-4 py-2 border rounded-full hover:shadow-sm transition text-primary"
            >
              Formulario
            </a>
          </div>
        </div>
      </section>

      {/* Tarjetas rápidas */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Correo */}
          <Card className="border rounded-none shadow-sm">
            <CardBody className="p-6 flex items-start gap-4">
              <Mail className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Correo institucional</p>
                <p className="text-sm text-black/60 mt-1">Canal oficial de consultas</p>

                <a href="mailto:simlar@emse.ar" className="text-primary hover:underline mt-2 block">
                  simlar@emse.ar
                </a>

                <p className="text-xs text-black/50 mt-1">Consultas institucionales y técnicas</p>
              </div>
            </CardBody>
          </Card>

          {/* Dirección */}
          <Card className="border rounded-none shadow-sm">
            <CardBody className="p-6 flex items-start gap-4">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Dirección</p>
                <p className="text-sm text-black/60 mt-1">Sede institucional</p>

                <p className="mt-2 text-black/80">
                  Pelagio B. Luna 173 (5300)
                  <br />
                  La Rioja, Argentina
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Formulario */}
          <Card className="border rounded-none shadow-sm">
            <CardBody className="p-6 flex items-start gap-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Formulario de consultas</p>
                <p className="text-sm text-black/60 mt-1">Envíanos tu consulta desde el portal</p>

                <p className="text-black/80 text-sm mt-2">
                  Nuestro equipo revisará tu mensaje y responderá según el orden de ingreso.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Contacto institucional */}
      <section id="contacto-institucional">
        <SectionHeader title="Contacto institucional" subtitle="Datos de contacto y comunicación oficial" />

        {/* Banner canales oficiales */}
        <Card className="border rounded-none shadow-sm mb-6">
          <CardBody className="p-4 text-sm text-black/70">
            Para una respuesta más rápida, utilizá el <strong>formulario</strong> o el correo oficial{' '}
            <a className="text-primary hover:underline" href="mailto:simlar@emse.ar">
              simlar@emse.ar
            </a>
            .
          </CardBody>
        </Card>

        <ContactoInstitucional />
      </section>

      {/* Ubicación */}
      <section id="ubicacion">
        <SectionHeader
          title="Ubicación"
          subtitle="Dirección institucional y acceso al mapa"
          right={
            <a
              href="https://www.google.com/maps/place/EMSE/@-29.4114941,-66.850607,15z/data=!4m6!3m5!1s0x9427dbceeb2c1623:0x29e8bdc76eefe5fd!8m2!3d-29.4114941!4d-66.850607!16s%2Fg%2F11kjlzvjrj"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Abrir en Google Maps
            </a>
          }
        />

        <Card className="border rounded-none shadow-sm overflow-hidden">
          <CardBody className="p-0">
            <div className="w-full h-90 md:h-105">
              <iframe
                title="Ubicación EMSE"
                src="https://www.google.com/maps?q=-29.4114941,-66.850607&z=16&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Dirección</p>
                <p className="text-black/70 mt-1">Pelagio B. Luna 173 (5300) — La Rioja, Argentina</p>
              </div>

              <Button
                as="a"
                href="https://www.google.com/maps/place/EMSE/@-29.4114941,-66.850607"
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-white"
              >
                Ver en Google Maps
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Formulario */}
      <section id="formulario">
        <SectionHeader title="Formulario de consultas" subtitle="Envíanos tu consulta o solicitud" />

        <Formulario />
      </section>
    </div>
  );
}
