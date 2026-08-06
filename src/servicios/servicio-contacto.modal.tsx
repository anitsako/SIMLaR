import { ClientOnly } from '@tanstack/react-router';
import {
  Alert,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Switch,
  Textarea,
  addToast,
} from '@heroui/react';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  Building2,
  Check,
  Globe2,
  MapPin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  SelectorUbicacionServicio,
} from './servicio-contacto.map';
import {
  upsertServicioContactoFn,
} from './upsert-servicio-contacto.fn';
import type { FormEvent } from 'react';

import type {
  ServicioContacto,
  ServicioContactoFormData,
} from './servicio-contacto.types';

interface Props {
  isOpen: boolean;
  contacto?: ServicioContacto;
  onClose: () => void;
}

const COORDENADAS_INICIALES = {
  latitud: -29.4131,
  longitud: -66.8558,
};

const crearEstadoInicial = (
  contacto?: ServicioContacto,
): ServicioContactoFormData => ({
  id: contacto?.id,
  nombre: contacto?.nombre ?? '',
  descripcion: contacto?.descripcion ?? '',
  tramites: contacto?.tramites ?? '',
  direccion: contacto?.direccion ?? '',
  latitud: contacto?.latitud ?? null,
  longitud: contacto?.longitud ?? null,
  horario: contacto?.horario ?? '',
  telefono: contacto?.telefono ?? '',
  whatsapp: contacto?.whatsapp ?? '',
  email: contacto?.email ?? '',
  sitioWeb: contacto?.sitioWeb ?? '',
  facebook: contacto?.facebook ?? '',
  instagram: contacto?.instagram ?? '',
  visible: contacto?.visible ?? false,
  orden: contacto?.orden ?? 0,
});

export function ServicioContactoModal({
  isOpen,
  contacto,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const guardarContacto = useServerFn(
    upsertServicioContactoFn,
  );

  const [data, setData] =
    useState<ServicioContactoFormData>(
      crearEstadoInicial(contacto),
    );

  const [mostrarMapa, setMostrarMapa] =
    useState(false);

  const [
    errorValidacion,
    setErrorValidacion,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setData(crearEstadoInicial(contacto));

    setMostrarMapa(
      contacto !== undefined &&
        contacto.latitud !== null &&
        contacto.longitud !== null,
    );

    setErrorValidacion(null);
  }, [contacto, isOpen]);

  const {
    mutateAsync,
    isPending,
    error,
  } = useMutation({
    mutationFn: (
      payload: ServicioContactoFormData,
    ) =>
      guardarContacto({
        data: payload,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['servicios-contactos'],
      });

      addToast({
        title: contacto
          ? 'Contacto actualizado'
          : 'Contacto creado',
        description:
          'La información fue guardada correctamente.',
        color: 'success',
        variant: 'solid',
      });

      onClose();
    },
  });

  const tieneUbicacion =
    data.latitud !== null &&
    data.latitud !== undefined &&
    data.longitud !== null &&
    data.longitud !== undefined;

  const latitudMapa =
    data.latitud ??
    COORDENADAS_INICIALES.latitud;

  const longitudMapa =
    data.longitud ??
    COORDENADAS_INICIALES.longitud;

  const mensajeError =
    errorValidacion || error?.message || null;

  const validar = (): boolean => {
    setErrorValidacion(null);

    if (!data.nombre.trim()) {
      setErrorValidacion(
        'Debe ingresar el nombre del organismo.',
      );

      return false;
    }

    const tieneLatitud =
      data.latitud !== null &&
      data.latitud !== undefined;

    const tieneLongitud =
      data.longitud !== null &&
      data.longitud !== undefined;

    if (tieneLatitud !== tieneLongitud) {
      setErrorValidacion(
        'La latitud y la longitud deben completarse juntas.',
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validar()) {
      return;
    }

    await mutateAsync(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        base: 'max-h-[92vh] overflow-hidden',
        wrapper: 'overflow-hidden py-4',
      }}
    >
      <ModalContent className="max-h-[92vh] overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[92vh] min-h-0 flex-col overflow-hidden"
        >
          <ModalHeader className="shrink-0 border-b border-default-200">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-50">
                <Building2 className="h-5 w-5 text-danger" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {contacto
                    ? `Editar ${contacto.nombre}`
                    : 'Agregar organismo de contacto'}
                </h2>

                <p className="mt-1 text-sm font-normal text-default-500">
                  Completá la información institucional,
                  los canales de atención y la ubicación.
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="min-h-0 flex-1 overflow-y-auto py-5">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold">
                    Información general
                  </h3>

                  <p className="text-sm text-default-500">
                    Datos principales que verá el público.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_170px]">
                  <Input
                    label="Nombre del organismo"
                    value={data.nombre}
                    onValueChange={(nombre) =>
                      setData((actual) => ({
                        ...actual,
                        nombre,
                      }))
                    }
                    maxLength={150}
                    isRequired
                    autoFocus
                  />

                  <NumberInput
                    label="Orden"
                    value={data.orden}
                    minValue={0}
                    maxValue={999}
                    onValueChange={(orden) =>
                      setData((actual) => ({
                        ...actual,
                        orden:
                          Number.isFinite(orden) &&
                          orden >= 0
                            ? Math.trunc(orden)
                            : 0,
                      }))
                    }
                    description="Menor = primero"
                  />
                </div>

                <Textarea
                  label="Descripción"
                  description="Explicá brevemente qué organismo es y qué tipo de atención brinda."
                  value={data.descripcion}
                  onValueChange={(descripcion) =>
                    setData((actual) => ({
                      ...actual,
                      descripcion,
                    }))
                  }
                  minRows={3}
                  maxLength={2000}
                />

                <Textarea
                  label="Trámites y consultas"
                  description="Escribí un trámite por renglón."
                  value={data.tramites}
                  onValueChange={(tramites) =>
                    setData((actual) => ({
                      ...actual,
                      tramites,
                    }))
                  }
                  minRows={6}
                  maxLength={3000}
                />

                <Divider />

                <div>
                  <h3 className="text-base font-semibold">
                    Canales de atención
                  </h3>

                  <p className="text-sm text-default-500">
                    Completá solamente los datos confirmados.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Horario de atención"
                    value={data.horario ?? ''}
                    onValueChange={(horario) =>
                      setData((actual) => ({
                        ...actual,
                        horario,
                      }))
                    }
                    maxLength={150}
                    placeholder="Lunes a viernes de 8:00 a 13:00"
                  />

                  <Input
                    label="Teléfono"
                    value={data.telefono ?? ''}
                    onValueChange={(telefono) =>
                      setData((actual) => ({
                        ...actual,
                        telefono,
                      }))
                    }
                    maxLength={50}
                    placeholder="+54 380 ..."
                  />

                  <Input
                    label="WhatsApp"
                    value={data.whatsapp ?? ''}
                    onValueChange={(whatsapp) =>
                      setData((actual) => ({
                        ...actual,
                        whatsapp,
                      }))
                    }
                    maxLength={50}
                    placeholder="+54 380 ..."
                  />

                  <Input
                    type="email"
                    label="Correo electrónico"
                    value={data.email ?? ''}
                    onValueChange={(email) =>
                      setData((actual) => ({
                        ...actual,
                        email,
                      }))
                    }
                    maxLength={150}
                    placeholder="correo@organismo.gob.ar"
                  />
                </div>

                <details className="rounded-xl border border-default-200 p-4">
                  <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
                    <Globe2 className="h-4 w-4 text-primary" />
                    Sitio web y redes sociales
                  </summary>

                  <p className="mt-1 text-sm text-default-500">
                    Campos opcionales.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Input
                      type="url"
                      label="Sitio web"
                      value={data.sitioWeb ?? ''}
                      onValueChange={(nuevoSitioWeb) =>
                        setData((actual) => ({
                          ...actual,
                          sitioWeb: nuevoSitioWeb,
                        }))
                      }
                      maxLength={300}
                      placeholder="https://..."
                    />

                    <Input
                      type="url"
                      label="Facebook"
                      value={data.facebook ?? ''}
                      onValueChange={(nuevoFacebook) =>
                        setData((actual) => ({
                          ...actual,
                          facebook: nuevoFacebook,
                        }))
                      }
                      maxLength={300}
                      placeholder="https://..."
                    />

                    <Input
                      type="url"
                      label="Instagram"
                      value={data.instagram ?? ''}
                      onValueChange={(nuevoInstagram) =>
                        setData((actual) => ({
                          ...actual,
                          instagram: nuevoInstagram,
                        }))
                      }
                      maxLength={300}
                      placeholder="https://..."
                    />
                  </div>
                </details>
              </section>

              <section className="space-y-4 lg:sticky lg:top-0 lg:self-start">
                <div>
                  <h3 className="text-base font-semibold">
                    Ubicación
                  </h3>

                  <p className="text-sm text-default-500">
                    Dirección y punto exacto del organismo.
                  </p>
                </div>

                <Input
                  label="Dirección"
                  value={data.direccion ?? ''}
                  onValueChange={(direccion) =>
                    setData((actual) => ({
                      ...actual,
                      direccion,
                    }))
                  }
                  maxLength={250}
                  placeholder="Pelagio B. Luna 811, La Rioja Capital"
                />

                <div className="rounded-xl border border-default-200 bg-default-50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-danger" />

                      <div>
                        <p className="text-sm font-medium">
                          Ubicación en el mapa
                        </p>

                        <p className="text-xs text-default-500">
                          Seleccioná el punto haciendo clic.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="flat"
                      color={
                        tieneUbicacion
                          ? 'success'
                          : 'primary'
                      }
                      startContent={
                        tieneUbicacion ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )
                      }
                      onPress={() =>
                        setMostrarMapa(
                          (actual) => !actual,
                        )
                      }
                    >
                      {mostrarMapa
                        ? 'Ocultar mapa'
                        : tieneUbicacion
                          ? 'Editar ubicación'
                          : 'Seleccionar ubicación'}
                    </Button>
                  </div>
                </div>

                {mostrarMapa ? (
                  <ClientOnly
                    fallback={
                      <div className="h-80 animate-pulse rounded-xl bg-default-200" />
                    }
                  >
                    <SelectorUbicacionServicio
                      latitud={latitudMapa}
                      longitud={longitudMapa}
                      onChange={({
                        latitud,
                        longitud,
                      }) =>
                        setData((actual) => ({
                          ...actual,
                          latitud,
                          longitud,
                        }))
                      }
                    />
                  </ClientOnly>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-default-300 bg-default-50 px-6 text-center">
                    <div>
                      <MapPin className="mx-auto mb-2 h-7 w-7 text-default-400" />

                      <p className="text-sm text-default-500">
                        Abrí el mapa para seleccionar o
                        modificar la ubicación.
                      </p>
                    </div>
                  </div>
                )}

                <details className="rounded-xl border border-default-200 p-4">
                  <summary className="cursor-pointer font-medium">
                    Coordenadas manuales
                  </summary>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <NumberInput
                      label="Latitud"
                      value={
                        data.latitud ?? undefined
                      }
                      minValue={-90}
                      maxValue={90}
                      step={0.000001}
                      onValueChange={(latitud) =>
                        setData((actual) => ({
                          ...actual,
                          latitud:
                            Number.isFinite(latitud)
                              ? latitud
                              : null,
                        }))
                      }
                    />

                    <NumberInput
                      label="Longitud"
                      value={
                        data.longitud ?? undefined
                      }
                      minValue={-180}
                      maxValue={180}
                      step={0.000001}
                      onValueChange={(longitud) =>
                        setData((actual) => ({
                          ...actual,
                          longitud:
                            Number.isFinite(longitud)
                              ? longitud
                              : null,
                        }))
                      }
                    />
                  </div>
                </details>
              </section>
            </div>

            {mensajeError && (
              <Alert color="danger">
                {mensajeError}
              </Alert>
            )}
          </ModalBody>

          <ModalFooter className="shrink-0 flex-col items-stretch gap-3 border-t border-default-200 bg-background sm:flex-row sm:items-center">
            <Switch
              isSelected={data.visible}
              onValueChange={(visible) =>
                setData((actual) => ({
                  ...actual,
                  visible,
                }))
              }
              className="sm:mr-auto"
            >
              <div>
                <p className="font-medium">
                  Mostrar al público
                </p>

                <p className="text-xs text-default-500">
                  Desactivado: se guarda como borrador.
                </p>
              </div>
            </Switch>

            <Button
              type="button"
              variant="light"
              onPress={onClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              color="danger"
              isLoading={isPending}
              startContent={
                !isPending ? (
                  <Check className="h-4 w-4" />
                ) : undefined
              }
            >
              {data.visible
                ? 'Guardar y publicar'
                : 'Guardar borrador'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
