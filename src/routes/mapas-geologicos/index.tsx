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
import { useTranslation } from 'react-i18next';
import type { Mapa } from '@/mapas/datos-mapas';
import { mapas } from '@/mapas/datos-mapas';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/mapas-geologicos/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImage = (path: string) => {
    setSelectedImage(path);
    onImageOpen();
  };

  return (
    <>
      <SectionTitle title={t('routes.mapasGeologicos.page.title')} />
      {mapas.map((mapa: Mapa, index: number) => (
        <div key={index} className="max-w-6xl mb-4">
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid grid-col grid-cols-8 relative">
              <div className={`col-span-8 col-start-1 mb-2`}>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold">{mapa.card.map((c) => t(c.title))}</h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>{mapa.card.map((c) => t(c.description))}</p>
                  </CardBody>
                </Card>
              </div>
              <div className="col-span-7 col-start-1 mb-2">
                <Accordion selectionMode="multiple">
                  {mapa.accordionDescription.map((item) => (
                    <AccordionItem key={item.key} aria-label={t(item.ariaLabel)} title={t(item.title)}>
                      {t(item.description)}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="col-start-8 flex flex-col items-end gap-4">
                <Image
                  className="w-[250px] md:w-[300px] object-cover"
                  src={mapa.path}
                  alt={t('routes.mapasGeologicos.miniaturaAlt')}
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
                <Image className="max-h-screen" src={selectedImage} alt={t('routes.mapasGeologicos.ampliadaAlt')} radius="none" />
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      ))}
    </>
  );
}
