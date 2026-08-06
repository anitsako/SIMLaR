import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Textarea,
  addToast,
} from '@heroui/react';
import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react';
import type { DragEvent, FormEvent } from 'react';
import { addGaleriaFotoFn } from '@/galeria-fotos/add-galeria-foto.fn';
import { removeGaleriaFotoFn } from '@/galeria-fotos/remove-galeria-foto.fn';
import { updateGaleriaFotoFn } from '@/galeria-fotos//update-galeria-foto.fn';
import { useGaleriaFotos } from '@/galeria-fotos/use-galeria-fotos';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/_authed/galeria-fotos/administrar/')({
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
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState({ descripcion: '' });
  const [descripcionDrafts, setDescripcionDrafts] = useState<Record<number, string>>({});
  const [fotoABorrar, setFotoABorrar] = useState<{ id: number; descripcion: string } | null>(null);
  const queryClient = useQueryClient();
  const { data: fotos = [], isFetching } = useGaleriaFotos();

  const addGaleriaFoto = useServerFn(addGaleriaFotoFn);
  const updateGaleriaFoto = useServerFn(updateGaleriaFotoFn);
  const removeGaleriaFoto = useServerFn(removeGaleriaFotoFn);

  const addMutation = useMutation({
    mutationFn: addGaleriaFoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeria-fotos'] });
      addToast({
        title: 'Imagen agregada',
        description: 'La foto fue agregada a la galería.',
        color: 'success',
        variant: 'solid',
      });
      setSelectedFile(undefined);
      setData({ descripcion: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateGaleriaFoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeria-fotos'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeGaleriaFoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeria-fotos'] });
      addToast({
        title: 'Imagen eliminada',
        description: 'La foto fue eliminada de la galería.',
        color: 'success',
        variant: 'solid',
      });
      setFotoABorrar(null);
    },
  });

  const getDescripcionDraft = (fotoId: number, descripcion: string) => descripcionDrafts[fotoId] ?? descripcion;

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
  };

  const handleAddImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      addToast({
        title: 'Falta la imagen',
        description: 'Seleccioná una imagen para continuar.',
        color: 'danger',
        variant: 'solid',
      });
      return;
    }

    try {
      const base64 = await fileToBase64(selectedFile);
      addMutation.mutate({
        data: {
          descripcion: data.descripcion.trim(),
          archivo: {
            nombre: selectedFile.name,
            tamaño: selectedFile.size,
            mimeType: selectedFile.type,
            base64,
          },
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

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    void handleFile(event.dataTransfer.files[0]);
  };

  const handleMove = (fotoId: number, move: 'up' | 'down') => {
    updateMutation.mutate({ data: { fotoId, move } });
  };

  const handleSaveDescription = (fotoId: number, descripcion: string) => {
    updateMutation.mutate({ data: { fotoId, descripcion } });
  };

  const handleRemove = (fotoId: number) => {
    removeMutation.mutate({ data: { fotoId } });
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Administrar galería de fotos" />

      {addMutation.error && <Alert color="danger">Error al agregar imagen: {addMutation.error.message}</Alert>}
      {updateMutation.error && <Alert color="danger">Error al actualizar imagen: {updateMutation.error.message}</Alert>}
      {removeMutation.error && <Alert color="danger">Error al eliminar imagen: {removeMutation.error.message}</Alert>}

      <form className="space-y-4 rounded-xl border border-default-200 bg-content1 p-4" onSubmit={handleAddImage}>
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className={`flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed p-4 transition ${
              isDragOver ? 'border-primary bg-primary/10' : 'border-default-300 bg-default-50'
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-default-500" />
              <p className="text-sm text-default-600">Arrastrá una imagen o seleccioná un archivo.</p>
              <Button type="button" variant="flat" onPress={() => inputRef.current?.click()}>
                Seleccionar imagen
              </Button>
              {selectedFile ? <p className="text-xs text-default-500">{selectedFile.name}</p> : null}
            </div>
          </div>
          <Textarea
            label="Descripción"
            value={data.descripcion}
            onValueChange={(value) => setData((prev) => ({ ...prev, descripcion: value }))}
            minRows={3}
            isRequired
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            void handleFile(file);
          }}
        />

        <div className="flex justify-end">
          <Button type="submit" color="primary" isLoading={addMutation.isPending}>
            Agregar foto
          </Button>
        </div>
      </form>

      {isFetching ? (
        <Skeleton className="h-[300px] w-full rounded-xl" />
      ) : fotos.length === 0 ? (
        <p>No hay fotos cargadas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {fotos.map((foto, index) => {
            const descripcionValue = getDescripcionDraft(foto.id, foto.descripcion);

            return (
              <Card key={foto.id}>
                <CardBody className="gap-4">
                  <div className="flex justify-center">
                    <Image
                      src={`/archivos/${foto.archivoImagenMiniaturaId}/${foto.archivoImagenMiniatura?.nombre ?? ''}`}
                      alt={foto.descripcion}
                      className="h-[200px] w-[200px]"
                      radius="none"
                    />
                  </div>

                  <Textarea
                    label="Descripción"
                    value={descripcionValue}
                    onValueChange={(value) => setDescripcionDrafts((prev) => ({ ...prev, [foto.id]: value }))}
                    minRows={3}
                  />

                  <p className="text-xs text-default-500">Orden actual: {index + 1}</p>
                </CardBody>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<ArrowUp className="h-4 w-4" />}
                    isDisabled={index === 0}
                    isLoading={updateMutation.isPending}
                    onPress={() => handleMove(foto.id, 'up')}
                  >
                    Subir
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<ArrowDown className="h-4 w-4" />}
                    isDisabled={index === fotos.length - 1}
                    isLoading={updateMutation.isPending}
                    onPress={() => handleMove(foto.id, 'down')}
                  >
                    Bajar
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    isLoading={updateMutation.isPending}
                    onPress={() => handleSaveDescription(foto.id, descripcionValue)}
                  >
                    Guardar descripción
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    startContent={<Trash2 className="h-4 w-4" />}
                    isLoading={removeMutation.isPending}
                    onPress={() => setFotoABorrar({ id: foto.id, descripcion: foto.descripcion })}
                  >
                    Quitar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={fotoABorrar !== null} onClose={() => setFotoABorrar(null)}>
        <ModalContent>
          <ModalHeader>Quitar foto</ModalHeader>
          <ModalBody>
            {fotoABorrar ? (
              <p>
                ¿Querés quitar <span className="font-semibold">{fotoABorrar.descripcion}</span> de la galería?
              </p>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setFotoABorrar(null)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              isLoading={removeMutation.isPending}
              onPress={() => {
                if (!fotoABorrar) {
                  return;
                }
                handleRemove(fotoABorrar.id);
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
