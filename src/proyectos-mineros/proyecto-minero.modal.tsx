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
import { Expand } from 'lucide-react';
import { useProyectoMinero } from './use-proyecto-minero';

function decimalToDms(decimal: number, isLat: boolean): string {
  const dir = isLat ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'O';
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const minFull = (abs - deg) * 60;
  const min = Math.floor(minFull);
  const sec = ((minFull - min) * 60).toFixed(2);
  return `${deg}° ${min}' ${sec}" ${dir}`;
}

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
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{data.nombre}</ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex flex-col gap-4">
            {data.archivoMapa && (
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
            )}
            <div className="flex flex-col">
              <FieldRow label="Ubicación" value={data.ubicacion} />
              <Divider className="my-2" />
              <FieldRow label="Provincia geológica" value={data.provinciaGeologica} />
              <Divider className="my-2" />
              <FieldRow label="Área" value={data.area} />
              <Divider className="my-2" />
              <FieldRow label="Etapa" value={data.etapa} />
              <Divider className="my-2" />
              <FieldRow label="Propietario" value={data.propietario} />
              <Divider className="my-2" />
              <FieldRow label="Mineral de interés" value={data.mineralInteres} />
              <Divider className="my-2" />
              <FieldRow label="Localidades cercanas" value={data.localidadesCercanas} />
              <Divider className="my-2" />
              <FieldRow label="Altitud (msnm)" value={data.msnm} />
              <Divider className="my-2" />
              <FieldRow label="Convenio EMSE" value={data.convenioEmse ? 'Sí' : 'No'} />
              <Divider className="my-2" />
              <FieldRow
                label="Coordenadas"
                value={`${decimalToDms(data.coordenadasGeograficas[1], true)}, ${decimalToDms(data.coordenadasGeograficas[0], false)}`}
              />
              <Divider className="my-2" />
              <Accordion className="px-0" isCompact>
                <AccordionItem title="Litología">
                  <p className="text-sm pb-2">{data.litologia}</p>
                </AccordionItem>
                <AccordionItem title="Mineralización">
                  <p className="text-sm pb-2">{data.mineralizacion}</p>
                </AccordionItem>
                <AccordionItem title="Modelo genético">
                  <p className="text-sm pb-2">{data.modeloGenetico}</p>
                </AccordionItem>
                <AccordionItem title="Accesos">
                  <p className="text-sm pb-2">{data.accesos}</p>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {data.archivoMapa && (
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
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
