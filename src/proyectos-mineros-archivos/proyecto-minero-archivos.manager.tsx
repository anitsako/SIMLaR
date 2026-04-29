import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Alert, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, addToast } from '@heroui/react';
import { File as FileIcon, Trash2, Upload } from 'lucide-react';
import { addProyectoMineroArchivosFn } from './add-proyecto-minero-archivos.fn';
import { removeProyectoMineroArchivoFn } from './remove-proyecto-minero-archivo.fn';
import { useProyectoMineroArchivos } from './use-proyecto-minero-archivos';
import type { ChangeEvent } from 'react';
import { formatBytes } from '@/common/format-bytes';

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

type ProyectoMineroArchivosManagerProps = {
  proyectoMineroId: number;
};

export const ProyectoMineroArchivosManager = ({ proyectoMineroId }: ProyectoMineroArchivosManagerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivoAEliminar, setArchivoAEliminar] = useState<{ archivoId: string; nombre: string } | null>(null);
  const queryClient = useQueryClient();
  const { data: archivos = [], isFetching } = useProyectoMineroArchivos(proyectoMineroId);

  const addProyectoMineroArchivos = useServerFn(addProyectoMineroArchivosFn);
  const removeProyectoMineroArchivo = useServerFn(removeProyectoMineroArchivoFn);

  const agregarArchivosMutation = useMutation({
    mutationFn: addProyectoMineroArchivos,
    onSuccess: (resultado) => {
      queryClient.invalidateQueries({ queryKey: ['proyectos-mineros-archivos', proyectoMineroId] });
      addToast({
        title: 'Archivo agregado',
        description: `Se cargó "${resultado.archivo.nombre}" correctamente.`,
        color: 'success',
        variant: 'solid',
      });
    },
  });

  const quitarArchivoMutation = useMutation({
    mutationFn: removeProyectoMineroArchivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos-mineros-archivos', proyectoMineroId] });
      addToast({
        title: 'Archivo quitado',
        description: 'El archivo fue desvinculado del proyecto minero.',
        color: 'success',
        variant: 'solid',
      });
      setArchivoAEliminar(null);
    },
  });

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    try {
      const archivo = {
        nombre: file.name,
        tamaño: file.size,
        mimeType: file.type || 'application/octet-stream',
        base64: await fileToBase64(file),
      };

      agregarArchivosMutation.mutate({ data: { proyectoMineroId, archivo } });
    } catch (error) {
      addToast({
        title: 'Error al preparar archivos',
        description: error instanceof Error ? error.message : 'No se pudieron procesar los archivos seleccionados.',
        color: 'danger',
        variant: 'solid',
      });
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    void handleFile(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <input ref={inputRef} type="file" className="hidden" onChange={onInputChange} />

      <div className="rounded-xl border border-default-300 bg-default-50 p-6 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
          <Upload className="h-8 w-8 text-default-500" />
          <p className="text-sm text-default-600">Seleccioná un archivo para agregar al proyecto minero.</p>
          <Button onPress={() => inputRef.current?.click()} isLoading={agregarArchivosMutation.isPending}>
            Agregar archivo
          </Button>
        </div>
      </div>

      {agregarArchivosMutation.error && (
        <Alert color="danger">Error al agregar archivo: {agregarArchivosMutation.error.message}</Alert>
      )}

      {quitarArchivoMutation.error && (
        <Alert color="danger">Error al quitar archivo: {quitarArchivoMutation.error.message}</Alert>
      )}

      {isFetching ? (
        <p>Cargando archivos...</p>
      ) : archivos.length === 0 ? (
        <p>Este proyecto no tiene archivos cargados.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {archivos.map((archivo) => (
            <div
              key={archivo.archivoId}
              className="group relative rounded-xl border border-default-200 bg-content1 p-3"
            >
              <a
                href={`/archivos/${archivo.archivoId}/${archivo.nombre}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 rounded-lg p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <FileIcon className="h-12 w-12 text-default-600" />
                <span className="line-clamp-2 break-all text-xs font-medium">{archivo.nombre}</span>
                <span className="text-xs text-default-500">{formatBytes(archivo.tamaño)}</span>
              </a>

              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
                aria-label={`Quitar ${archivo.nombre}`}
                onPress={() => setArchivoAEliminar({ archivoId: archivo.archivoId, nombre: archivo.nombre })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!archivoAEliminar} onClose={() => setArchivoAEliminar(null)}>
        <ModalContent>
          <ModalHeader>Quitar archivo</ModalHeader>
          <ModalBody>
            {archivoAEliminar ? (
              <p>
                ¿Querés quitar <span className="font-semibold">{archivoAEliminar.nombre}</span> del proyecto minero?
              </p>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setArchivoAEliminar(null)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              isLoading={quitarArchivoMutation.isPending}
              onPress={() => {
                if (!archivoAEliminar) return;
                quitarArchivoMutation.mutate({
                  data: {
                    proyectoMineroId,
                    archivoId: archivoAEliminar.archivoId,
                  },
                });
              }}
            >
              Quitar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
