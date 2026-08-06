import { useMemo, useState } from 'react';
import { Button, Card, CardBody, Image, Modal, ModalBody, ModalContent, Skeleton } from '@heroui/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';
import { useGaleriaFotos } from '@/galeria-fotos/use-galeria-fotos';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/galeria-fotos/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: fotos = [], isFetching } = useGaleriaFotos();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fotoSeleccionada = useMemo(() => {
    if (selectedIndex === null) {
      return null;
    }
    return fotos[selectedIndex] ?? null;
  }, [fotos, selectedIndex]);

  const openFoto = (index: number) => {
    setSelectedIndex(index);
  };

  const closeFoto = () => {
    setSelectedIndex(null);
  };

  const moveFoto = (direction: 'prev' | 'next') => {
    if (fotos.length === 0 || selectedIndex === null) {
      return;
    }

    const nextIndex =
      direction === 'prev' ? (selectedIndex - 1 + fotos.length) % fotos.length : (selectedIndex + 1) % fotos.length;
    setSelectedIndex(nextIndex);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Galería de fotos" />

      {isFetching ? (
        <Skeleton className="h-[300px] w-full rounded-xl" />
      ) : fotos.length === 0 ? (
        <p>No hay fotos cargadas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fotos.map((foto, index) => (
            <Card key={foto.id} className="overflow-hidden">
              <CardBody className="gap-3">
                <div className="relative flex justify-center">
                  <Image
                    className="w-[200px] h-[200px]"
                    src={`/archivos/${foto.archivoImagenMiniaturaId}/${foto.archivoImagenMiniatura?.nombre ?? ''}`}
                    alt={foto.descripcion}
                    radius="none"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="solid"
                    className="absolute bottom-2 right-2 z-10"
                    onPress={() => openFoto(index)}
                  >
                    <Expand size={16} />
                  </Button>
                </div>
                <p className="line-clamp-3 text-sm text-default-600">{foto.descripcion}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={selectedIndex !== null} onClose={closeFoto} size="full" className="bg-black">
        <ModalContent>
          <ModalBody className="relative flex items-center justify-center overflow-hidden bg-black p-0">
            {fotoSeleccionada ? (
              <>
                <Button
                  isIconOnly
                  variant="solid"
                  className="absolute left-4 top-1/2 z-20 -translate-y-1/2"
                  aria-label="Imagen anterior"
                  onPress={() => moveFoto('prev')}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  isIconOnly
                  variant="solid"
                  className="absolute right-4 top-1/2 z-20 -translate-y-1/2"
                  aria-label="Imagen siguiente"
                  onPress={() => moveFoto('next')}
                >
                  <ChevronRight size={20} />
                </Button>
                <Button
                  isIconOnly
                  variant="flat"
                  className="absolute right-4 top-4 z-20"
                  aria-label="Cerrar"
                  onPress={closeFoto}
                >
                  <X size={18} />
                </Button>
                <img
                  src={`/archivos/${fotoSeleccionada.archivoImagenId}/${fotoSeleccionada.archivoImagen?.nombre ?? ''}`}
                  alt={fotoSeleccionada.descripcion}
                  className="max-h-[100vh] max-w-[100vw] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 p-4 text-white">
                  <p className="mx-auto max-w-4xl text-center text-sm md:text-base">{fotoSeleccionada.descripcion}</p>
                </div>
              </>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
