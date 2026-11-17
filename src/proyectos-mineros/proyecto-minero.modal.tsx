import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { Expand, File as FileIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useProyectoMinero } from './use-proyecto-minero';
import { decimalToDms } from '@/common/decimal-to-dms';
import { formatBytes } from '@/common/format-bytes';
import { useProyectoMineroArchivos } from '@/proyectos-mineros-archivos/use-proyecto-minero-archivos';

const hectareasFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 w-44 text-left">{label}</span>
      <span className="text-right flex-1">{value}</span>
    </div>
  );
}

interface Props {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProyectoMineroModal = ({ id, isOpen, onClose }: Props) => {
  const { data } = useProyectoMinero(id!, { enabled: id !== null && isOpen });
  const { data: archivos, isFetching: isArchivosFetching } = useProyectoMineroArchivos(id!, {
    enabled: id !== null && isOpen,
  });
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{data.nombre}</ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Image
                className="w-full"
                src={`/archivos/${data.archivoMapa.id}/${data.archivoMapa.nombre}`}
                alt={data.archivoMapa.nombre}
                radius="none"
              />
              <Button
                isIconOnly
                size="sm"
                variant="solid"
                className="absolute bottom-2 right-2 z-10"
                onPress={onImageOpen}
              >
                <Expand size={16} />
              </Button>
            </div>
            <div className="flex flex-col">
              <Button variant="faded" as={Link} to={`/proyectos-mineros/${id}/mapa`}>
                {t('routes.proyectosMineros.modal.modeloTerreno')}
              </Button>
              <Divider className="my-2" />
              <Button variant="faded" as={Link} to={`/proyectos-mineros/${id}/modelo-3d`}>
                {t('routes.proyectosMineros.modal.modelo3d')}
              </Button>
              <FieldRow label={t('routes.proyectosMineros.modal.ubicacion')} value={data.ubicacion} />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.provinciaGeologica')} value={data.provinciaGeologica} />
              <Divider className="my-2" />
              <FieldRow
                label={t('routes.proyectosMineros.modal.superficie')}
                value={
                  data.areaHectareas !== null
                    ? t('routes.proyectosMineros.modal.superficieHa', { valor: hectareasFormatter.format(data.areaHectareas) })
                    : data.area
                }
              />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.etapa')} value={data.etapa.nombre} />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.propietario')} value={data.propietario} />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.mineral')} value={data.mineralInteres} />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.localidades')} value={data.localidadesCercanas} />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.altitud')} value={data.msnm} />
              <Divider className="my-2" />
              <FieldRow label={t('routes.proyectosMineros.modal.convenio')} value={data.convenioEmse ? t('common.si') : t('common.no')} />
              <Divider className="my-2" />
              <FieldRow
                label={t('routes.proyectosMineros.modal.coordenadas')}
                value={`${decimalToDms(data.coordenadasGeograficas[1], true)}, ${decimalToDms(data.coordenadasGeograficas[0], false)}`}
              />
              <Divider className="my-2" />
              <Accordion className="px-0" isCompact>
                <AccordionItem title={t('routes.proyectosMineros.modal.litologia')}>
                  <p className="text-sm pb-2">{data.litologia}</p>
                </AccordionItem>
                <AccordionItem title={t('routes.proyectosMineros.modal.mineralizacion')}>
                  <p className="text-sm pb-2">{data.mineralizacion}</p>
                </AccordionItem>
                <AccordionItem title={t('routes.proyectosMineros.modal.modeloGenetico')}>
                  <p className="text-sm pb-2">{data.modeloGenetico}</p>
                </AccordionItem>
                <AccordionItem title={t('routes.proyectosMineros.modal.accesos')}>
                  <p className="text-sm pb-2">{data.accesos}</p>
                </AccordionItem>
              </Accordion>

              <Divider className="my-2" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">{t('routes.proyectosMineros.modal.archivos')}</h3>
                {isArchivosFetching ? (
                  <p className="text-sm text-default-500">{t('routes.proyectosMineros.modal.cargandoArchivos')}</p>
                ) : archivos.length === 0 ? (
                  <p className="text-sm text-default-500">{t('routes.proyectosMineros.modal.sinArchivos')}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {archivos.map((archivo) => (
                      <a
                        key={archivo.archivoId}
                        href={`/archivos/${archivo.archivoId}/${archivo.nombre}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-1 rounded-lg border border-default-200 p-2 text-center hover:bg-default-50"
                      >
                        <FileIcon size={32} className="text-default-600" />
                        <span className="line-clamp-2 break-all text-xs font-medium">{archivo.nombre}</span>
                        <span className="text-xs text-default-500">{formatBytes(archivo.tamaño)}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Modal isOpen={isImageOpen} onClose={onImageClose} size="full">
            <ModalContent>
              <ModalBody className="flex items-center justify-center p-0 bg-black">
                <Image
                  className="max-h-screen max-w-full object-contain"
                  src={`/archivos/${data.archivoMapa.id}/${data.archivoMapa.nombre}`}
                  alt={data.archivoMapa.nombre}
                  radius="none"
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
