import { ClientOnly } from '@tanstack/react-router';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
} from '@heroui/react';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Clock3,
  ExternalLink,
  Facebook,
  Globe2,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Pencil,
  Phone,
} from 'lucide-react';
import { useState } from 'react';

import { ServicioContactoMap } from './servicio-contacto.map';
import type {
  ServicioContacto,
} from './servicio-contacto.types';

interface Props {
  contacto: ServicioContacto;
  puedeEditar: boolean;
  onEdit: (contacto: ServicioContacto) => void;
}

function normalizarEnlace(
  valor: string | null,
): string | null {
  if (!valor) {
    return null;
  }

  if (/^https?:\/\//i.test(valor)) {
    return valor;
  }

  return `https://${valor}`;
}

export function ServicioContactoCard({
  contacto,
  puedeEditar,
  onEdit,
}: Props) {
  const [mapaVisible, setMapaVisible] =
    useState(false);

  const tramites = contacto.tramites
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const telefonoNormalizado =
    contacto.telefono
      ? contacto.telefono.replace(
          /[^\d+]/g,
          '',
        )
      : null;

  const whatsappNormalizado =
    contacto.whatsapp
      ? contacto.whatsapp.replace(
          /\D/g,
          '',
        )
      : null;

  const sitioWeb = normalizarEnlace(
    contacto.sitioWeb,
  );

  const facebook = normalizarEnlace(
    contacto.facebook,
  );

  const instagram = normalizarEnlace(
    contacto.instagram,
  );

  const tieneMapa =
    contacto.latitud !== null &&
    contacto.longitud !== null;

  const googleMapsUrl = tieneMapa
    ? `https://www.google.com/maps?q=${contacto.latitud},${contacto.longitud}`
    : null;

  const tieneDatosContacto =
    contacto.direccion ||
    contacto.horario ||
    contacto.telefono ||
    contacto.whatsapp ||
    contacto.email;

  return (
    <Card className="overflow-hidden rounded-none border border-default-300 border-l-4 border-l-danger shadow-sm">
      <CardBody className="p-0">
        <div className="space-y-5 p-5 md:p-6">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-danger/10">
                <Building2 className="h-5 w-5 text-danger" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-default-700">
                    {contacto.nombre}
                  </h3>

                  {puedeEditar &&
                  !contacto.visible ? (
                    <Chip
                      size="sm"
                      color="warning"
                      variant="flat"
                    >
                      Borrador
                    </Chip>
                  ) : null}
                </div>

                {contacto.descripcion ? (
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-default-600">
                    {contacto.descripcion}
                  </p>
                ) : null}
              </div>
            </div>

            {puedeEditar ? (
              <Button
                size="sm"
                variant="flat"
                startContent={
                  <Pencil className="h-4 w-4" />
                }
                onPress={() =>
                  onEdit(contacto)
                }
              >
                Editar
              </Button>
            ) : null}
          </div>

          {tieneDatosContacto ? (
            <>
              <Divider />

              {/* Información institucional */}
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {contacto.direccion ? (
                  <DatoContacto
                    icono={
                      <MapPin className="h-4 w-4" />
                    }
                    etiqueta="Dirección"
                    valor={contacto.direccion}
                  />
                ) : null}

                {contacto.horario ? (
                  <DatoContacto
                    icono={
                      <Clock3 className="h-4 w-4" />
                    }
                    etiqueta="Horario de atención"
                    valor={contacto.horario}
                  />
                ) : null}

                {contacto.telefono ? (
                  <DatoContacto
                    icono={
                      <Phone className="h-4 w-4" />
                    }
                    etiqueta="Teléfono"
                    valor={contacto.telefono}
                  />
                ) : null}

                {contacto.whatsapp ? (
                  <DatoContacto
                    icono={
                      <MessageCircle className="h-4 w-4" />
                    }
                    etiqueta="WhatsApp"
                    valor={contacto.whatsapp}
                  />
                ) : null}

                {contacto.email ? (
                  <DatoContacto
                    icono={
                      <Mail className="h-4 w-4" />
                    }
                    etiqueta="Correo electrónico"
                    valor={contacto.email}
                  />
                ) : null}
              </div>
            </>
          ) : (
            <p className="border border-dashed border-default-300 p-4 text-sm text-default-500">
              Los datos de contacto todavía no fueron
              completados.
            </p>
          )}

          {tramites.length > 0 ? (
            <>
              <Divider />

              {/* Trámites */}
              <div>
                <h4 className="text-sm font-semibold text-default-700">
                  Consultas y trámites relacionados
                </h4>

                <ul className="mt-3 grid list-disc gap-x-10 gap-y-2 pl-5 text-sm leading-6 text-default-600 md:grid-cols-2 lg:grid-cols-3">
                  {tramites.map((tramite) => (
                    <li key={tramite}>
                      {tramite}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          <Divider />

          {/* Acciones */}
          <div className="flex flex-wrap items-center gap-2">
            {googleMapsUrl ? (
              <Button
                as="a"
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="danger"
                variant="flat"
                startContent={
                  <Navigation className="h-4 w-4" />
                }
              >
                Cómo llegar
              </Button>
            ) : null}

            {whatsappNormalizado ? (
              <Button
                as="a"
                href={`https://wa.me/${whatsappNormalizado}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="flat"
                startContent={
                  <MessageCircle className="h-4 w-4" />
                }
              >
                WhatsApp
              </Button>
            ) : null}

            {telefonoNormalizado ? (
              <Button
                as="a"
                href={`tel:${telefonoNormalizado}`}
                variant="flat"
                startContent={
                  <Phone className="h-4 w-4" />
                }
              >
                Llamar
              </Button>
            ) : null}

            {contacto.email ? (
              <Button
                as="a"
                href={`mailto:${contacto.email}`}
                variant="flat"
                startContent={
                  <Mail className="h-4 w-4" />
                }
              >
                Correo
              </Button>
            ) : null}

            {sitioWeb ? (
              <Button
                as="a"
                href={sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
                variant="flat"
                startContent={
                  <Globe2 className="h-4 w-4" />
                }
                endContent={
                  <ExternalLink className="h-3.5 w-3.5" />
                }
              >
                Sitio web
              </Button>
            ) : null}

            {facebook ? (
              <Button
                as="a"
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                isIconOnly
                variant="flat"
                aria-label={`Facebook de ${contacto.nombre}`}
              >
                <Facebook className="h-4 w-4" />
              </Button>
            ) : null}

            {instagram ? (
              <Button
                as="a"
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                isIconOnly
                variant="flat"
                aria-label={`Instagram de ${contacto.nombre}`}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            ) : null}

            {tieneMapa ? (
              <Button
                type="button"
                variant="light"
                className="sm:ml-auto"
                endContent={
                  mapaVisible ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                }
                onPress={() =>
                  setMapaVisible(
                    (visible) => !visible,
                  )
                }
              >
                {mapaVisible
                  ? 'Ocultar ubicación'
                  : 'Ver ubicación'}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Mapa desplegable */}
        {tieneMapa && mapaVisible ? (
          <div className="border-t border-default-300 bg-default-50 p-4 md:p-5">
            <ClientOnly
              fallback={
                <div className="h-72 animate-pulse bg-default-200" />
              }
            >
              <ServicioContactoMap
                nombre={contacto.nombre}
                latitud={contacto.latitud!}
                longitud={contacto.longitud!}
                className="h-72"
              />
            </ClientOnly>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

function DatoContacto({
  icono,
  etiqueta,
  valor,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-danger">
        {icono}
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-default-400">
          {etiqueta}
        </p>

        <p className="mt-1 wrap-break-word text-sm leading-5 text-default-700">
          {valor}
        </p>
      </div>
    </div>
  );
}