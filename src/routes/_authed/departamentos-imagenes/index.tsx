import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import {
  Alert,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  addToast,
  useDisclosure,
} from '@heroui/react';
import { Expand, Trash2, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { addImagenDepartamentoFn } from '@/departamentos/add-imagen-departamento.fn';
import { removeImagenDepartamentoFn } from '@/departamentos/remove-imagen-departamento.fn';
import { updateImagenDepartamentoFn } from '@/departamentos/update-imagen-departamento.fn';
import { useDepartamentosImagenes } from '@/departamentos/use-departamentos-imagenes';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/_authed/departamentos-imagenes/')({
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
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [imagenAEliminar, setImagenAEliminar] = useState<{ departamentoId: number; departamentoNombre: string } | null>(
    null
  );
  const [imagenExpandida, setImagenExpandida] = useState<{ archivoId: string; nombre: string } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { data: departamentos = [], isFetching } = useDepartamentosImagenes();

  const addImagenDepartamento = useServerFn(addImagenDepartamentoFn);
  const updateImagenDepartamento = useServerFn(updateImagenDepartamentoFn);
  const removeImagenDepartamento = useServerFn(removeImagenDepartamentoFn);

  const addMutation = useMutation({
    mutationFn: addImagenDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos-imagenes'] });
      queryClient.invalidateQueries({ queryKey: ['capa-departamentos'] });
      addToast({
        title: 'Imagen agregada',
        description: 'La imagen del departamento fue cargada correctamente.',
        color: 'success',
        variant: 'solid',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateImagenDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos-imagenes'] });
      queryClient.invalidateQueries({ queryKey: ['capa-departamentos'] });
      addToast({
        title: 'Imagen actualizada',
        description: 'La imagen del departamento fue actualizada correctamente.',
        color: 'success',
        variant: 'solid',
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeImagenDepartamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos-imagenes'] });
      queryClient.invalidateQueries({ queryKey: ['capa-departamentos'] });
      addToast({
        title: 'Imagen quitada',
        description: 'La imagen del departamento fue eliminada.',
        color: 'success',
        variant: 'solid',
      });
      setImagenAEliminar(null);
    },
  });

  const handleUpload = async (
    departamento: { id: number; nombre: string; archivoImagen: { id: string; nombre: string } | null },
    file: File | undefined
  ) => {
    if (!file) {
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      if (departamento.archivoImagen) {
        updateMutation.mutate({
          data: {
            departamentoId: departamento.id,
            archivo: { nombre: file.name, tamaño: file.size, mimeType: file.type, base64 },
          },
        });
        return;
      }

      addMutation.mutate({
        data: {
          departamentoId: departamento.id,
          archivo: { nombre: file.name, tamaño: file.size, mimeType: file.type, base64 },
        },
      });
    } catch (error) {
      addToast({
        title: 'Error al subir imagen',
        description: error instanceof Error ? error.message : 'Ocurrió un error desconocido',
        color: 'danger',
        variant: 'solid',
      });
    }
  };

  const handleChangeFile =
    (departamento: { id: number; nombre: string; archivoImagen: { id: string; nombre: string } | null }) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      void handleUpload(departamento, file);
    };

  const openImageModal = (archivoId: string, nombre: string) => {
    setImagenExpandida({ archivoId, nombre });
    onOpen();
  };

  return (
    <div className="flex flex-col mt-4 gap-6">
      <SectionTitle title="Imágenes por departamento" />

      {addMutation.error && <Alert color="danger">Error al agregar imagen: {addMutation.error.message}</Alert>}
      {updateMutation.error && <Alert color="danger">Error al actualizar imagen: {updateMutation.error.message}</Alert>}
      {removeMutation.error && <Alert color="danger">Error al quitar imagen: {removeMutation.error.message}</Alert>}

      {isFetching ? (
        <Skeleton className="h-[320px] w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {departamentos.map((departamento) => (
            <div key={departamento.id} className="rounded-xl border border-default-200 bg-content1 p-4">
              <p className="mb-3 text-sm font-semibold">{departamento.nombre}</p>

              {departamento.archivoImagen ? (
                <div className="space-y-3">
                  <div className="h-[180px] overflow-hidden rounded-lg bg-default-100">
                    <Image
                      removeWrapper
                      src={`/archivos/${departamento.archivoImagen.id}/${departamento.archivoImagen.nombre}`}
                      alt={departamento.archivoImagen.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<Expand className="h-4 w-4" />}
                      onPress={() => openImageModal(departamento.archivoImagen!.id, departamento.archivoImagen!.nombre)}
                    >
                      Expandir
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      startContent={<Upload className="h-4 w-4" />}
                      isLoading={updateMutation.isPending}
                      onPress={() => inputRefs.current[departamento.id]?.click()}
                    >
                      Cambiar imagen
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      startContent={<Trash2 className="h-4 w-4" />}
                      isLoading={removeMutation.isPending}
                      onPress={() =>
                        setImagenAEliminar({ departamentoId: departamento.id, departamentoNombre: departamento.nombre })
                      }
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-default-300 bg-default-50">
                  <Button
                    size="sm"
                    startContent={<Upload className="h-4 w-4" />}
                    isLoading={addMutation.isPending}
                    onPress={() => inputRefs.current[departamento.id]?.click()}
                  >
                    Agregar imagen
                  </Button>
                </div>
              )}

              <input
                ref={(element) => {
                  inputRefs.current[departamento.id] = element;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChangeFile(departamento)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          <ModalBody className="p-0 bg-black">
            {imagenExpandida ? (
              <Image
                removeWrapper
                src={`/archivos/${imagenExpandida.archivoId}/${imagenExpandida.nombre}`}
                alt={imagenExpandida.nombre}
                className="max-h-[90vh] w-full object-contain"
              />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={!!imagenAEliminar} onClose={() => setImagenAEliminar(null)}>
        <ModalContent>
          <ModalHeader>Quitar imagen</ModalHeader>
          <ModalBody>
            {imagenAEliminar ? (
              <p>
                ¿Querés quitar la imagen de <span className="font-semibold">{imagenAEliminar.departamentoNombre}</span>?
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
                if (!imagenAEliminar) {
                  return;
                }
                removeMutation.mutate({ data: { departamentoId: imagenAEliminar.departamentoId } });
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
