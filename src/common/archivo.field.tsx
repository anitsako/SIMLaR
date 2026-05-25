import { useId, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import type { ChangeEvent } from 'react';

export const ArchivoField = ({
  label,
  required,
  accept = "image/png, image/jpeg, image/webp, .tif, .tiff, image/tiff",
  onChange,
}: {
  label: string;
  required?: boolean;
  accept: string;
  onChange: (file: File | undefined) => void;
}) => {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisibleFile, setIsVisibleFile] = useState(true);

  const esImagenVisible = (file: File) => ['image/webp', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0]
      setSelectedFile(file);
      if (esImagenVisible(file)) {
        setPreviewUrl(URL.createObjectURL(file));
        setIsVisibleFile(true)
      } else {
        setIsVisibleFile(false)
      }

      setIsModalOpen(true);
      onChange(file);
    } else {
      setSelectedFile(undefined);
      setPreviewUrl(undefined);
      setIsModalOpen(false);
      onChange(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="file-upload" className="text-sm font-medium text-default">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="block w-full text-sm text-default
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary
                  file:cursor-pointer cursor-pointer"
        required={required}
      />
      {selectedFile && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-default-500">
            Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
          {isVisibleFile && (
            <Button size="sm" variant="solid" radius="full" onPress={() => setIsModalOpen(true)}>
              Ver
            </Button>

          )}
        </div>
      )}
      {previewUrl && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl">
          <ModalContent>
            <ModalHeader>
              <h3 className="text-lg font-bold">Vista previa</h3>
            </ModalHeader>
            <ModalBody>
              <p>Esta es la vista previa del archivo seleccionado.</p>
              <img
                src={previewUrl}
                alt="Vista previa del archivo"
                className="w-full h-auto object-contain rounded-lg mb-4"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
