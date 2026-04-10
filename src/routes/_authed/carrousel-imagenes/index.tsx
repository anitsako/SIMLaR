import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  addToast,
  useDisclosure,
} from '@heroui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { cargarImagenesCarrouselFn } from '@/carrousel-imagenes/cargar-imagenes-carrousel.fn';
import { useImagenesCarrousel } from '@/carrousel-imagenes/use-imagenes-carrousel.fn';
import { uploadArchivoFn } from '@/common/uploadArchivo';

// @ts-ignore: Se ignora css
import 'swiper/css';
// @ts-ignore: Se ignora css
import 'swiper/css/free-mode';
// @ts-ignore: Se ignora css
import 'swiper/css/pagination';
// @ts-ignore: Se ignora css
import 'swiper/css/navigation';

export const Route = createFileRoute('/_authed/carrousel-imagenes/')({
  component: RouteComponent,
});

type ImageItem = {
  preview: string | null;
  archivoId: string | null;
};

function RouteComponent() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);
  const [images, setImages] = useState<Array<ImageItem>>([
    { preview: null, archivoId: null },
    { preview: null, archivoId: null },
    { preview: null, archivoId: null },
    { preview: null, archivoId: null },
  ]);
  const { data: imagenesCarrousel = [] } = useImagenesCarrousel();
  const [positions, setPositions] = useState<Array<number>>([50, 50, 50, 50]);
  const [cambios, setCambios] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (initialized) return;
    if (imagenesCarrousel.length > 0) {
      const washed = imagenesCarrousel.slice(0, 4).map((img: any) => ({
        preview: img.base64 ? `data:${img.mimeType};base64,${img.base64}` : null,
        archivoId: img.archivoId ?? null,
      }));
      setImages((prev) => prev.map((item, idx) => (washed[idx] ? washed[idx] : item)));
      const loadedPositions = imagenesCarrousel
        .slice(0, 4)
        .map((img: any) => img.positionY ?? 50)
        .concat([50, 50, 50, 50])
        .slice(0, 4);
      setPositions(loadedPositions);
      setInitialized(true);
    }
  }, [imagenesCarrousel, initialized]);

  const cargarImagenesCarrousel = useServerFn(cargarImagenesCarrouselFn);
  const uploadArchivo = useServerFn(uploadArchivoFn);

  const navigate = useNavigate();

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await uploadArchivo({
        data: {
          archivo: {
            nombre: file.name,
            tamaño: file.size,
            mimeType: file.type,
            base64,
          },
        },
      });

      const url = URL.createObjectURL(file);

      const newImages = [...images];
      newImages[index] = { preview: url, archivoId: res.archivoId };
      setImages(newImages);
      setCambios(true);
    } catch (error) {
      addToast({
        title: 'Error al subir imagen',
        description: error instanceof Error ? error.message : 'Ocurrió un error desconocido',
        color: 'danger',
        variant: 'solid',
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = { preview: null, archivoId: null };
    setImages(newImages);
    setCambios(true);
  };

  const handleGoBack = () => {
    if (!cambios) {
      navigate({ to: '/' });
      return;
    }

    onOpen();
  };

  const handleSave = async () => {
    const validImages = images.filter((img) => img.archivoId);
    if (validImages.length !== 4) {
      addToast({
        title: 'No hay suficientes imágenes para cargar',
        description: 'Agrega imagenes para cargar en el carrousel.',
        color: 'warning',
        variant: 'solid',
      });
      return;
    }

    try {
      await cargarImagenesCarrousel({
        data: {
          imagenes: images.map((img, index) => ({
            archivoId: img.archivoId!,
            positionY: positions[index],
            orden: index,
          })),
        },
      });

      setCambios(false);
      addToast({
        title: 'Imágenes cargadas',
        description: 'Las imágenes del carrousel fueron cargadas correctamente.',
        color: 'success',
        variant: 'solid',
      });
      navigate({ to: '/' });
    } catch (error) {
      addToast({
        title: 'Error al guardar',
        description: error instanceof Error ? error.message : 'Ocurrió un error',
        color: 'danger',
        variant: 'solid',
      });
    }
  };

  return (
    <div className="flex flex-col mt-4">
      <p className="text-5xl font-bold text-center">Configuración del carrousel de imágenes</p>
      <div className="mt-4">
        <Swiper
          modules={[Autoplay, FreeMode, Navigation, Thumbs]}
          spaceBetween={10}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper, slideThumbActiveClass: 'thumb-active' }}
          scrollbar={{ draggable: true }}
          navigation
          className="h-[400px] w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="h-full">
              {image.preview ? (
                <img
                  src={image.preview}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `center ${positions[index]}%` }}
                />
              ) : (
                <Skeleton className="h-full w-full rounded-xl" />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <form className="mt-4 flex flex-col items-center gap-4">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView={4}
            className="h-[100px] w-full mt-4 cursor-pointer"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="relative group h-full">
                {image.preview ? (
                  <img src={image.preview} className="h-full w-full object-cover" />
                ) : (
                  <Skeleton className="h-full w-full" />
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`file-${index}`}
                    onChange={(e) => handleChangeImage(e, index)}
                  />

                  {image.archivoId === null ? (
                    <Button onPress={() => document.getElementById(`file-${index}`)?.click()}>Agregar</Button>
                  ) : (
                    <Button onPress={() => document.getElementById(`file-${index}`)?.click()}>Cambiar</Button>
                  )}

                  {image.archivoId && (
                    <Button color="danger" size="sm" onPress={() => handleRemoveImage(index)}>
                      Eliminar
                    </Button>
                  )}

                  {image.archivoId && (
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={positions[index]}
                      onChange={(e) => {
                        const newPos = [...positions];
                        newPos[index] = Number(e.target.value);
                        setPositions(newPos);
                        setCambios(true);
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-row gap-4 mb-4">
            <Button
              onPress={() => {
                handleSave();
              }}
            >
              Guardar
            </Button>

            <Button color="primary" onPress={handleGoBack}>
              Volver
            </Button>
          </div>
        </form>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader>Salir sin guardar</ModalHeader>
          <ModalBody>Tienes cambios sin guardar. Si sales ahora, perderás esos cambios.</ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={() => {
                onClose();
                navigate({ to: '/' });
              }}
            >
              Salir sin guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
