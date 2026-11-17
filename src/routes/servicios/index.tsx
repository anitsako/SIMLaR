import {
  Alert,
  Button,
  Card,
  CardBody,
  Spinner,
} from '@heroui/react';
import {
  createFileRoute,
  getRouteApi,
} from '@tanstack/react-router';
import {
  Building2,
  ClipboardList,
  Construction,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

import 'leaflet/dist/leaflet.css';

import type {
  ServicioContacto,
} from '@/servicios/servicio-contacto.types';
import SectionTitle from '@/common/section-title';
import { ServicioContactoCard } from '@/servicios/servicio-contacto.card';
import { DirectorioContacto } from '@/servicios/servicio-contacto.directorio';
import { ServicioContactoModal } from '@/servicios/servicio-contacto.modal';
import {
  useServiciosContactos,
} from '@/servicios/use-servicios-contactos';

export const Route = createFileRoute('/servicios/')({
  component: RouteComponent,
});

const rootRoute = getRouteApi('__root__');

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

function SectionHeader({
  title,
  subtitle,
  right,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-danger/60 pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-default-700">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-default-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {right ? (
        <div className="shrink-0">
          {right}
        </div>
      ) : null}
    </div>
  );
}

function RouteComponent() {
  const { t } = useTranslation();
  const { usuario } =
    rootRoute.useRouteContext();

  const autenticado = usuario !== null;

  const {
    data: contactos = [],
    isLoading,
    error,
  } = useServiciosContactos(autenticado);

  const [
    modalAbierto,
    setModalAbierto,
  ] = useState(false);

  const [
    contactoEditando,
    setContactoEditando,
  ] = useState<
    ServicioContacto | undefined
  >();

  const abrirNuevo = () => {
    setContactoEditando(undefined);
    setModalAbierto(true);
  };

  const abrirEdicion = (
    contacto: ServicioContacto,
  ) => {
    setContactoEditando(contacto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setContactoEditando(undefined);
  };

  return (
    <div className="mt-4 space-y-10 pb-12">
      <section>
        <SectionTitle
          title={t('routes.servicios.page.title')}
          subtitle={t('routes.servicios.page.subtitle')}
        />
      </section>

      <section>
        <SectionHeader
          title={t('routes.servicios.proveedores.title')}
          subtitle={t('routes.servicios.proveedores.subtitle')}
        />

        <Card className="rounded-none border border-default-300 shadow-sm">
          <CardBody className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-danger/10">
                  <ClipboardList className="h-6 w-6 text-danger" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-default-700">
                    {t('routes.servicios.proveedores.portalTitulo')}
                  </h3>

                  <p className="mt-2 max-w-4xl text-sm leading-6 text-default-600">
                    {t('routes.servicios.proveedores.portalDescripcion')}
                  </p>

                  <p className="mt-2 text-xs text-default-500">
                    {t('routes.servicios.proveedores.enlaceExterno')}
                  </p>
                </div>
              </div>

              <Button
                as="a"
                href="https://proveedoresmineros.larioja.gob.ar/"
                target="_blank"
                rel="noopener noreferrer"
                color="danger"
                endContent={
                  <ExternalLink className="h-4 w-4" />
                }
                className="w-full md:w-auto"
              >
                {t('routes.servicios.proveedores.abrirPortal')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Trámites digitales */}
      <section>
        <SectionHeader
          title={t('routes.servicios.tramitesDigitales.title')}
        />

        <Alert
          color="warning"
          variant="flat"
          icon={
            <Construction className="h-5 w-5" />
          }
          className="rounded-none border border-warning/30"
        >
          <div>
            <p className="font-semibold">
              {t('routes.servicios.tramitesDigitales.enDesarrollo')}
            </p>

            <p className="mt-1 text-sm leading-6">
              {t('routes.servicios.tramitesDigitales.descripcion')}
            </p>
          </div>
        </Alert>
      </section>

      {/* Organismos */}
      <section>
        <SectionHeader
          title={t('routes.servicios.organismos.title')}
          subtitle={t('routes.servicios.organismos.subtitle')}
          right={
            autenticado ? (
              <Button
                size="sm"
                color="danger"
                startContent={
                  <Plus className="h-4 w-4" />
                }
                onPress={abrirNuevo}
              >
                {t('routes.servicios.organismos.agregar')}
              </Button>
            ) : undefined
          }
        />

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center border border-default-300 bg-background">
            <Spinner label={t('routes.servicios.organismos.cargando')} />
          </div>
        ) : null}

        {error ? (
          <Alert
            color="danger"
            variant="flat"
            className="rounded-none"
          >
            {t('routes.servicios.organismos.error')}
          </Alert>
        ) : null}

        {!isLoading &&
          !error &&
          contactos.length === 0 ? (
          <Card className="rounded-none border border-dashed border-default-300 shadow-none">
            <CardBody className="flex min-h-48 flex-col items-center justify-center p-8 text-center">
              <Building2 className="mb-3 h-8 w-8 text-default-400" />

              <p className="font-medium text-default-700">
                {t('routes.servicios.organismos.vacioTitulo')}
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-default-500">
                {autenticado
                  ? t('routes.servicios.organismos.vacioAdmin')
                  : t('routes.servicios.organismos.vacioPublico')}
              </p>

              {autenticado ? (
                <Button
                  className="mt-4"
                  size="sm"
                  color="danger"
                  variant="flat"
                  startContent={
                    <Plus className="h-4 w-4" />
                  }
                  onPress={abrirNuevo}
                >
                  {t('routes.servicios.organismos.agregar')}
                </Button>
              ) : null}
            </CardBody>
          </Card>
        ) : null}

        {!isLoading &&
          !error &&
          contactos.length > 0 ? (
          <div className="space-y-5">
            {contactos.map(
              (contacto) => (
                <ServicioContactoCard
                  key={contacto.id}
                  contacto={contacto}
                  puedeEditar={autenticado}
                  onEdit={abrirEdicion}
                />
              ),
            )}
          </div>
        ) : null}
      </section>

      {/* Directorio de correos y redes */}
      <section>
        <SectionHeader
          title={t('routes.servicios.directorio.title')}
          subtitle={t('routes.servicios.directorio.subtitle')}
        />

        <DirectorioContacto />
      </section>

      {autenticado ? (
        <ServicioContactoModal
          isOpen={modalAbierto}
          contacto={contactoEditando}
          onClose={cerrarModal}
        />
      ) : null}
    </div>
  );
}
