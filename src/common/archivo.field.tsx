import { useState } from 'react';
import type { ChangeEvent } from 'react';

export const ArchivoField = ({ label, onChange }: { label: string; onChange: (file: File | undefined) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setSelectedFile(e.target.files[0]);
      onChange(e.target.files[0]);
    } else {
      setSelectedFile(undefined);
      onChange(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="file-upload" className="text-sm font-medium text-default">
        {label}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-default
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary
                  file:cursor-pointer cursor-pointer"
        required
      />
      {selectedFile && (
        <p className="text-sm text-default-500">
          Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
    </div>
  );
};
