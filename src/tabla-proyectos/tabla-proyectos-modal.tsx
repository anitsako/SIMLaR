import { useState } from 'react';
import { useDisclosure } from '@heroui/react';
import { BookOpenText } from 'lucide-react';
import { useProyectosMineros } from '@/proyectos-mineros/use-proyectos-mineros';
import { ProyectoMineroModal } from '@/proyectos-mineros/proyecto-minero.modal';

export const ModalTablaProyectos = () => {
  const { data: proyectosMineros } = useProyectosMineros();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!proyectosMineros) return null;

  return (
    <>
      {proyectosMineros.map((proyectoMinero) => (
        <div key={proyectoMinero.id}>
          <a
            className="cursor-pointer inline-block w-fit h-fit"
            onClick={() => {
              setSelectedId(proyectoMinero.id);
              onOpen();
            }}
          >
            <BookOpenText className="w-6 h-6 opacity-60" />
          </a>
          <ProyectoMineroModal id={selectedId} isOpen={isOpen} onClose={onClose}></ProyectoMineroModal>
        </div>
      ))}
    </>
  );
};

