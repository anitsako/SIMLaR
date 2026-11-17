import {
  Alert,
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from '@heroui/react';
import { Expand } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

import { useDepartamento } from './use-departamento';
import { PoblacionComparativaChart } from '@/indicadores-sociales/graficos/poblacion-comparativa.chart';
import { DistribucionSexoChart } from '@/indicadores-sociales/graficos/distribucion-sexo.chart';
import { PiramidePoblacionalChart } from '@/indicadores-sociales/graficos/piramide-poblacional.chart';
import { OcupacionCategoriaChart } from '@/indicadores-sociales/graficos/ocupacion-categoria.chart';
import { useIndicadoresDepartamento } from '@/indicadores-sociales/use-indicadores-departamento';



interface Props {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatearNumero = (
  valor: number | null | undefined
): string => {
  if (valor === null || valor === undefined) {
    return i18n.t('common.estados.sinDato');
  }

  return valor.toLocaleString('es-AR');
};

const formatearDecimal = (
  valor: number | null | undefined
): string => {
  if (valor === null || valor === undefined) {
    return i18n.t('common.estados.sinDato');
  }

  return valor.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
};

export const DepartamentoModal = ({
  id,
  isOpen,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const { data: departamento } = useDepartamento(id ?? 0, {
    enabled: id !== null && isOpen,
  });

  const {
    data: indicadores,
    isLoading: isLoadingIndicadores,
    error: indicadoresError,
  } = useIndicadoresDepartamento(
    id !== null && isOpen ? id : null
  );

  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  if (!departamento) {
    return null;
  }

const poblacion2010 = indicadores?.poblacion2010;
const poblacion2022 = indicadores?.poblacion2022;
const mujeres2022 = indicadores?.mujeres2022;
const varones2022 = indicadores?.varones2022;

const tienePoblaciones =
  typeof poblacion2010 === 'number' &&
  typeof poblacion2022 === 'number';

const variacionAbsoluta = tienePoblaciones
  ? poblacion2022 - poblacion2010
  : null;

const variacionRelativa =
  tienePoblaciones && poblacion2010 > 0
    ? ((poblacion2022 - poblacion2010) /
        poblacion2010) *
      100
    : null;

const indiceFeminidad =
  typeof mujeres2022 === 'number' &&
  typeof varones2022 === 'number' &&
  varones2022 > 0
    ? (mujeres2022 / varones2022) * 100
    : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {departamento.nombre}
          </ModalHeader>

          <ModalBody className="pb-6">
            <div className="flex flex-col gap-6">
              {departamento.archivoImagen ? (
                <div className="relative">
                  <Image
                    className="w-full"
                    src={`/archivos/${departamento.archivoImagen.id}/${departamento.archivoImagen.nombre}`}
                    alt={departamento.archivoImagen.nombre}
                    radius="none"
                  />

                  <Button
                    isIconOnly
                    size="sm"
                    variant="solid"
                    className="absolute bottom-2 right-2 z-10"
                    onPress={onImageOpen}
                    aria-label={t('routes.inicio.departamento.ampliarImagen')}
                  >
                    <Expand size={16} />
                  </Button>
                </div>
              ) : (
                <Alert color="warning" variant="flat">
                  {t('routes.inicio.departamento.sinImagen')}
                </Alert>
              )}

              <section className="space-y-5 border-t border-default-200 pt-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {t('routes.inicio.departamento.infoSocialTitulo')}
                  </h2>

                  <p className="text-sm text-default-500">
                    {t('routes.inicio.departamento.infoSocialDescripcion')}
                  </p>
                </div>

                {isLoadingIndicadores ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map(
                      (_, indice) => (
                        <Skeleton
                          key={indice}
                          className="h-28 rounded-xl"
                        />
                      )
                    )}
                  </div>
                ) : null}

                {indicadoresError ? (
                  <Alert color="danger">
                    {t('routes.inicio.departamento.errorIndicadores')}
                  </Alert>
                ) : null}

                {!isLoadingIndicadores &&
                !indicadoresError &&
                !indicadores ? (
                  <Alert color="warning" variant="flat">
                    {t('routes.inicio.departamento.sinIndicadores')}
                  </Alert>
                ) : null}

                {indicadores ? (
  <>
    {/* =====================================================
        1. INDICADORES PRINCIPALES
        Son las cuatro tarjetas que resumen rápidamente
        la situación social del departamento.
       ===================================================== */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Población total correspondiente al Censo 2022 */}
      <Card
        shadow="sm"
        className="border border-default-200"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.poblacion2022')}
          </p>

          <p className="text-2xl font-semibold">
            {formatearNumero(
              indicadores.poblacion2022
            )}
          </p>

          <p className="text-xs text-default-400">
            {t('routes.inicio.departamento.habitantes')}
          </p>
        </CardBody>
      </Card>

      {/* Variación absoluta y porcentual entre 2010 y 2022 */}
      <Card
        shadow="sm"
        className="border border-default-200"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.variacion')}
          </p>

          <p className="text-2xl font-semibold">
            {variacionRelativa === null
              ? t('common.estados.sinDato')
              : `${variacionRelativa >= 0 ? '+' : ''}${variacionRelativa.toLocaleString(
                  'es-AR',
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }
                )} %`}
          </p>

          <p className="text-xs text-default-400">
            {variacionAbsoluta === null
              ? t('routes.inicio.departamento.sinComparacion')
              : t('routes.inicio.departamento.variacionHabitantes', {
                  valor: `${variacionAbsoluta >= 0 ? '+' : ''}${formatearNumero(variacionAbsoluta)}`,
                })}
          </p>
        </CardBody>
      </Card>

      {/* Edad que divide a la población en dos mitades */}
      <Card
        shadow="sm"
        className="border border-default-200"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.edadMediana')}
          </p>

          <p className="text-2xl font-semibold">
            {formatearDecimal(
              indicadores.edadMedianaTotal
            )}
          </p>

          <p className="text-xs text-default-400">
            {t('routes.inicio.departamento.anios')}
          </p>
        </CardBody>
      </Card>

      {/* Cantidad de mujeres cada 100 varones */}
      <Card
        shadow="sm"
        className="border border-default-200"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.indiceFeminidad')}
          </p>

          <p className="text-2xl font-semibold">
            {formatearDecimal(indiceFeminidad)}
          </p>

          <p className="text-xs text-default-400">
            {t('routes.inicio.departamento.mujeresCada100')}
          </p>
        </CardBody>
      </Card>
    </div>

    {/* =====================================================
        2. GRÁFICOS GENERALES
        En pantallas grandes se muestran uno al lado del otro.
        En pantallas chicas aparecen uno debajo del otro.
       ===================================================== */}
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {/* Gráfico de barras que compara 2010 con 2022 */}
      {typeof indicadores.poblacion2010 ===
        'number' &&
      typeof indicadores.poblacion2022 ===
        'number' ? (
        <PoblacionComparativaChart
          poblacion2010={
            indicadores.poblacion2010
          }
          poblacion2022={
            indicadores.poblacion2022
          }
        />
      ) : null}

      {/* Barra apilada con el porcentaje de mujeres y varones */}
      {typeof indicadores.mujeres2022 ===
        'number' &&
      typeof indicadores.varones2022 ===
        'number' ? (
        <DistribucionSexoChart
          mujeres={indicadores.mujeres2022}
          varones={indicadores.varones2022}
        />
      ) : null}
    </div>

    {/* =====================================================
        3. DATOS SOCIALES COMPLEMENTARIOS
        Refuerzan la información mostrada en los gráficos.
       ===================================================== */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Población informada por el Censo 2010 */}
      <Card
        shadow="none"
        className="bg-default-50"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.poblacion2010')}
          </p>

          <p className="text-xl font-semibold">
            {formatearNumero(
              indicadores.poblacion2010
            )}
          </p>
        </CardBody>
      </Card>

      {/* Total de mujeres en 2022 */}
      <Card
        shadow="none"
        className="bg-default-50"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.mujeres2022')}
          </p>

          <p className="text-xl font-semibold">
            {formatearNumero(
              indicadores.mujeres2022
            )}
          </p>
        </CardBody>
      </Card>

      {/* Total de varones en 2022 */}
      <Card
        shadow="none"
        className="bg-default-50"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.varones2022')}
          </p>

          <p className="text-xl font-semibold">
            {formatearNumero(
              indicadores.varones2022
            )}
          </p>
        </CardBody>
      </Card>
    </div>

    {/* Edad mediana separada por sexo */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        shadow="none"
        className="bg-default-50"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.edadMedianaMujeres')}
          </p>

          <p className="text-xl font-semibold">
            {formatearDecimal(
              indicadores.edadMedianaMujeres
            )}{' '}
            {t('routes.inicio.departamento.anios')}
          </p>
        </CardBody>
      </Card>

      <Card
        shadow="none"
        className="bg-default-50"
      >
        <CardBody className="gap-1">
          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.edadMedianaVarones')}
          </p>

          <p className="text-xl font-semibold">
            {formatearDecimal(
              indicadores.edadMedianaVarones
            )}{' '}
            {t('routes.inicio.departamento.anios')}
          </p>
        </CardBody>
      </Card>
    </div>

    {/* =====================================================
        4. PIRÁMIDE POBLACIONAL
        Solo aparece cuando existen datos por edad y sexo.
       ===================================================== */}
    {indicadores.poblacionPorEdadSexo.length >
    0 ? (
      <PiramidePoblacionalChart
        datos={
          indicadores.poblacionPorEdadSexo
        }
      />
    ) : null}

    {/* =====================================================
        5. ACTIVIDAD ECONÓMICA
        Solo aparece cuando existen datos ocupacionales.
       ===================================================== */}
    {indicadores.ocupacionPorCategoria.length >
    0 ? (
      <section className="space-y-4 border-t border-default-200 pt-6">
        <div>
          <h2 className="text-2xl font-semibold">
            {t('routes.inicio.departamento.actividadEconomicaTitulo')}
          </h2>

          <p className="text-sm text-default-500">
            {t('routes.inicio.departamento.actividadEconomicaDescripcion')}
          </p>
        </div>

        {/* Barras horizontales por categoría y sexo */}
        <OcupacionCategoriaChart
          datos={
            indicadores.ocupacionPorCategoria
          }
        />
      </section>
    ) : null}

    {/* =====================================================
        6. FUENTE Y OBSERVACIONES
        Se muestra al final de la ficha departamental.
       ===================================================== */}
    <div className="rounded-xl bg-default-50 p-4">
      <p className="text-sm font-semibold">
        {t('routes.inicio.departamento.fuente')}
      </p>

      <p className="mt-1 text-sm text-default-500">
        {indicadores.fuente}
      </p>

      {/* Las observaciones solo aparecen si fueron cargadas */}
      {indicadores.observaciones ? (
        <>
          <p className="mt-4 text-sm font-semibold">
            {t('routes.inicio.departamento.observaciones')}
          </p>

          <p className="mt-1 text-sm text-default-500">
            {indicadores.observaciones}
          </p>
        </>
      ) : null}
    </div>
  </>
) : null}

              </section>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {departamento.archivoImagen ? (
        <Modal
          isOpen={isImageOpen}
          onClose={onImageClose}
          size="full"
        >
          <ModalContent>
            <ModalBody className="flex items-center justify-center bg-black p-0">
              <Image
                className="max-h-screen max-w-full object-contain"
                src={`/archivos/${departamento.archivoImagen.id}/${departamento.archivoImagen.nombre}`}
                alt={departamento.archivoImagen.nombre}
                radius="none"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
};