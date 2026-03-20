import { useDisclosure } from '@heroui/react';
import { useState } from 'react';
import { ProyectoMineroModal } from './proyecto-minero.modal';
import { useProyectosMineros } from './use-proyectos-mineros';
import type { MarkerShape } from '@/mapa-principal/main-marker';
import { MainMarker } from '@/mapa-principal/main-marker';

export const ProyectosMinerosLayer = () => {
  const { data: proyectosMineros } = useProyectosMineros({ visible: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <>
      {proyectosMineros.result.map((proyectoMinero, index) => (
        <MainMarker
          key={proyectoMinero.id}
          position={[proyectoMinero.coordenadasGeograficas[1], proyectoMinero.coordenadasGeograficas[0]]}
          value={index + 1}
          title={`Proyecto: ${proyectoMinero.nombre}`}
          color="red"
          shape={proyectoMinero.tipo.forma as MarkerShape}
          onClick={() => {
            setSelectedId(proyectoMinero.id);
            onOpen();
          }}
        />
      ))}
      <ProyectoMineroModal id={selectedId} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
