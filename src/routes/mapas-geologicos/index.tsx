import { createFileRoute } from '@tanstack/react-router';
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@heroui/react';
import { Expand } from 'lucide-react';
import { useState } from 'react';
import type { Mapa } from '@/mapas/datos-mapas';
import { mapas } from '@/mapas/datos-mapas';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/mapas-geologicos/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImage = (path: string) => {
    setSelectedImage(path);
    onImageOpen();
  };

  return (
    <>
      <SectionTitle title="Mapas geológicos" sizeTitle="5xl" textCenter />
      {mapas.map((mapa: Mapa, index: number) => (
        <div key={index} className="max-w-6xl mb-4">
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid grid-col grid-cols-8 relative">
              <div className={`col-span-8 col-start-1 mb-2`}>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold">{mapa.card.map((c) => c.title)}</h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>{mapa.card.map((c) => c.description)}</p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-span-7 col-start-1 mb-2">
                <Accordion selectionMode="multiple">
                  {mapa.accordionDescription.map((item) => (
                    <AccordionItem key={item.key} aria-label={item.ariaLabel} title={item.title}>
                      {item.description}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="col-start-8 flex flex-col items-end gap-4">
                <Image
                  className="w-[250px] md:w-[300px] object-cover"
                  src={mapa.path}
                  alt="Hoja geológica del país"
                  radius="none"
                />
                <Button isIconOnly size="sm" variant="solid" className="" onPress={() => handleImage(mapa.path)}>
                  <Expand size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Modal isOpen={isImageOpen} onClose={onImageClose} size="full">
            <ModalContent>
              <ModalBody className="pb-6 flex items-center justify-center">
                <Image className="max-h-screen" src={selectedImage} alt="Hoja geológica" radius="none" />
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      ))}
    </>
  );
}
