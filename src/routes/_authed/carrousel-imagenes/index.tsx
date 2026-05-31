import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Autoplay, Navigation } from 'swiper/modules';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  addToast,
} from '@heroui/react';
import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { ChangeEvent, DragEvent } from 'react';
import { addImagenCarrouselFn } from '@/carrousel-imagenes/add-imagen-carrousel.fn';
import { removeImagenCarrouselFn } from '@/carrousel-imagenes/remove-imagen-carrousel.fn';
import { updateImagenCarrouselFn } from '@/carrousel-imagenes/update-imagen-carrousel.fn';
import { useImagenesCarrousel } from '@/carrousel-imagenes/use-imagenes-carrousel';
import SectionTitle from '@/common/sectionTitle';

// @ts-ignore: Se ignora css
import 'swiper/css';
// @ts-ignore: Se ignora css
import 'swiper/css/navigation';

export const Route = createFileRoute('/_authed/carrousel-imagenes/')({
  component: RouteComponent,
});

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function RouteComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagenAEliminar, setImagenAEliminar] = useState<{ archivoId: string; nombre: string } | null>(null);
  const [positionDrafts, setPositionDrafts] = useState<Record<string, number | null>>({});
  const queryClient = useQueryClient();
  const { data: imagenesCarrousel = [], isFetching } = useImagenesCarrousel();

  const addImagenCarrousel = useServerFn(addImagenCarrouselFn);
  const updateImagenCarrousel = useServerFn(updateImagenCarrouselFn);
  const removeImagenCarrousel = useServerFn(removeImagenCarrouselFn);

  const addMutation = useMutation({
    mutationFn: addImagenCarrousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagenes-carrousel'] });
      addToast({
        title: 'Imagen agregada',
        description: 'La imagen fue agregada al final del carrusel.',
        color: 'success',
        variant: 'solid',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateImagenCarrousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagenes-carrousel'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeImagenCarrousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagenes-carrousel'] });
      addToast({
        title: 'Imagen quitada',
        description: 'La imagen fue removida del carrusel.',
        color: 'success',
        variant: 'solid',
      });
      setImagenAEliminar(null);
    },
  });

  const getPositionDraft = (archivoId: string, positionY: number | null) => {
    const draft = positionDrafts[archivoId];
    return draft ?? positionY ?? 50;
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      addMutation.mutate({ data: { archivo: { nombre: file.name, tamaño: file.size, mimeType: file.type, base64 } } });
    } catch (error) {
      addToast({
        title: 'Error al subir imagen',
        description: error instanceof Error ? error.message : 'Ocurrió un error desconocido',
        color: 'danger',
        variant: 'solid',
      });
    }
  };

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    void handleFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    void handleFile(file);
  };

  const handleMove = (archivoId: string, move: 'up' | 'down') => {
    updateMutation.mutate({ data: { archivoId, move } });
  };

  const handleSavePosition = (archivoId: string, value: number) => {
    updateMutation.mutate({ data: { archivoId, positionY: value } });
  };

  const handleRemoveImage = (archivoId: string) => {
    removeMutation.mutate({ data: { archivoId } });
  };

  return (
    <div className="flex flex-col mt-4 space-y-6">
      <SectionTitle title="Configuración del carrousel de imágenes" textCenter />

      {addMutation.error && <Alert color="danger">Error al agregar imagen: {addMutation.error.message}</Alert>}
      {updateMutation.error && <Alert color="danger">Error al actualizar imagen: {updateMutation.error.message}</Alert>}
      {removeMutation.error && <Alert color="danger">Error al quitar imagen: {removeMutation.error.message}</Alert>}

      {isFetching ? (
        <Skeleton className="h-[300px] w-full rounded-xl" />
      ) : imagenesCarrousel.length === 0 ? (
        <p>No hay imágenes cargadas en el carrusel.</p>
      ) : (
        <>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            className="h-[300px] w-full"
          >
            {imagenesCarrousel.map((image, index) => (
              <SwiperSlide key={image.archivoId} className="h-full">
                <img
                  src={`/archivos/${image.archivoId}/${image.nombre}`}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `center ${image.positionY}%` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {imagenesCarrousel.map((image, index) => {
              const positionValue = getPositionDraft(image.archivoId, image.positionY);

              return (
                <div key={image.archivoId} className="rounded-xl border border-default-200 bg-content1 p-4">
                  <div className="mb-3 h-[160px] overflow-hidden rounded-lg bg-default-100">
                    <img
                      src={`/archivos/${image.archivoId}/${image.nombre}`}
                      alt={image.nombre}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `center ${positionValue}%` }}
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Orden actual: {index + 1}</p>
                    <p className="line-clamp-1 text-xs text-default-500">{image.nombre}</p>

                    <div>
                      <p className="mb-1 text-xs font-medium text-default-600">Posición vertical</p>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={positionValue}
                        className="w-full"
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setPositionDrafts((prev) => ({ ...prev, [image.archivoId]: value }));
                        }}
                      />
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-xs text-default-500">{positionValue}%</span>
                        <Button
                          size="sm"
                          onPress={() => handleSavePosition(image.archivoId, positionValue)}
                          isLoading={updateMutation.isPending}
                        >
                          Guardar altura
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<ArrowUp className="h-4 w-4" />}
                        isDisabled={index === 0}
                        isLoading={updateMutation.isPending}
                        onPress={() => handleMove(image.archivoId, 'up')}
                      >
                        Subir orden
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<ArrowDown className="h-4 w-4" />}
                        isDisabled={index === imagenesCarrousel.length - 1}
                        isLoading={updateMutation.isPending}
                        onPress={() => handleMove(image.archivoId, 'down')}
                      >
                        Bajar orden
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<Trash2 className="h-4 w-4" />}
                        isLoading={removeMutation.isPending}
                        onPress={() => setImagenAEliminar({ archivoId: image.archivoId, nombre: image.nombre })}
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleAddImage} />

      <div
        className={`rounded-xl border-2 border-dashed p-6 text-center transition ${isDragOver ? 'border-primary bg-primary/10' : 'border-default-300 bg-default-50'
          }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
          <Upload className="h-8 w-8 text-default-500" />
          <p className="text-sm text-default-600">Arrastrá y soltá una imagen aquí o seleccioná una imagen.</p>
          <Button onPress={() => inputRef.current?.click()} isLoading={addMutation.isPending}>
            Agregar imagen
          </Button>
        </div>
      </div>

      <Modal isOpen={!!imagenAEliminar} onClose={() => setImagenAEliminar(null)}>
        <ModalContent>
          <ModalHeader>Quitar imagen</ModalHeader>
          <ModalBody>
            {imagenAEliminar ? (
              <p>
                ¿Querés quitar <span className="font-semibold">{imagenAEliminar.nombre}</span> del carrusel?
              </p>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setImagenAEliminar(null)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              isLoading={removeMutation.isPending}
              onPress={() => {
                if (!imagenAEliminar) return;
                handleRemoveImage(imagenAEliminar.archivoId);
              }}
            >
              Quitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
