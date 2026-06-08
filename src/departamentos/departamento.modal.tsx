import { Button, Image, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { Expand } from 'lucide-react';
import { useDepartamento } from './use-departamento';

interface Props {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DepartamentoModal = ({ id, isOpen, onClose }: Props) => {
  const { data } = useDepartamento(id!, { enabled: id !== null && isOpen });
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();

  if (!data) {
    return null;
  }

  if (!data.archivoImagen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{data.nombre}</ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Image
                className="w-full"
                src={`/archivos/${data.archivoImagen.id}/${data.archivoImagen.nombre}`}
                alt={data.archivoImagen.nombre}
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
          </div>

          <Modal isOpen={isImageOpen} onClose={onImageClose} size="full">
            <ModalContent>
              <ModalBody className="flex items-center justify-center p-0 bg-black">
                <Image
                  className="max-h-screen max-w-full object-contain"
                  src={`/archivos/${data.archivoImagen.id}/${data.archivoImagen.nombre}`}
                  alt={data.archivoImagen.nombre}
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
