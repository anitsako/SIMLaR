import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Chip,
  Skeleton,
} from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { ChartBar, Pencil, Plus } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';
import { IndicadoresDepartamentoModal } from '@/indicadores-sociales/indicadores-departamento.modal';
import { useDepartamentosIndicadores } from '@/indicadores-sociales/use-departamentos-indicadores';

export const Route = createFileRoute('/_authed/indicadores-sociales/')({
  component: RouteComponent,
});

type DepartamentoSeleccionado = {
  id: number;
  nombre: string;
};

function RouteComponent() {
  const { t } = useTranslation();
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    useState<DepartamentoSeleccionado | null>(null);

  const {
    data: departamentos = [],
    isFetching,
    error,
  } = useDepartamentosIndicadores();

  const cantidadCargados = departamentos.filter(
    (departamento) => departamento.tieneIndicadores
  ).length;

  const cantidadPendientes =
    departamentos.length - cantidadCargados;

  const seleccionarDepartamento = (
    departamento: DepartamentoSeleccionado
  ) => {
    setDepartamentoSeleccionado(departamento);
  };

  const cerrarModal = () => {
    setDepartamentoSeleccionado(null);
  };

  return (
    <div className="mt-4 flex flex-col gap-6">
      <SectionTitle
        title={t('routes.admin.indicadoresSociales.page.title')}
        subtitle={t('routes.admin.indicadoresSociales.page.subtitle')}
      />

      {error ? (
        <Alert color="danger">
          {t('routes.admin.indicadoresSociales.errorDepartamentos', { mensaje: error.message })}
        </Alert>
      ) : null}

      {isFetching && departamentos.length === 0 ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card shadow="sm">
              <CardBody>
                <p className="text-sm text-default-500">
                  {t('routes.admin.indicadoresSociales.departamentos')}
                </p>

                <p className="text-3xl font-semibold">
                  {departamentos.length}
                </p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody>
                <p className="text-sm text-default-500">
                  {t('routes.admin.indicadoresSociales.conDatos')}
                </p>

                <p className="text-3xl font-semibold text-success">
                  {cantidadCargados}
                </p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody>
                <p className="text-sm text-default-500">
                  {t('routes.admin.indicadoresSociales.pendientes')}
                </p>

                <p className="text-3xl font-semibold text-warning">
                  {cantidadPendientes}
                </p>
              </CardBody>
            </Card>
          </div>

          {departamentos.length === 0 && !error ? (
            <Alert color="warning">
              {t('routes.admin.indicadoresSociales.sinDepartamentos')}
            </Alert>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {departamentos.map((departamento) => (
              <Card
                key={departamento.id}
                shadow="sm"
                className="border border-default-200"
              >
                <CardBody className="flex flex-row items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                      <ChartBar className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-semibold">
                        {departamento.nombre}
                      </p>

                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          departamento.tieneIndicadores
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {departamento.tieneIndicadores
                          ? t('routes.admin.indicadoresSociales.datosCargados')
                          : t('routes.admin.indicadoresSociales.sinDatos')}
                      </Chip>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    color={
                      departamento.tieneIndicadores
                        ? 'default'
                        : 'primary'
                    }
                    variant={
                      departamento.tieneIndicadores
                        ? 'flat'
                        : 'solid'
                    }
                    startContent={
                      departamento.tieneIndicadores ? (
                        <Pencil className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )
                    }
                    onPress={() =>
                      seleccionarDepartamento({
                        id: departamento.id,
                        nombre: departamento.nombre,
                      })
                    }
                  >
                    {departamento.tieneIndicadores
                      ? t('common.acciones.editar')
                      : t('common.acciones.cargar')}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      <IndicadoresDepartamentoModal
        isOpen={departamentoSeleccionado !== null}
        departamento={departamentoSeleccionado}
        onClose={cerrarModal}
      />
    </div>
  );
}