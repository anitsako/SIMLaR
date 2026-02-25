import { useDisclosure } from '@heroui/react';
import { useState } from 'react';
import { ProyectoMineroModal } from './proyecto-minero.modal';
import { useProyectosMineros } from './use-proyectos-mineros';
import type { MarkerColor } from '@/mapa-principal/circle-marker';
import { CircleMarker } from '@/mapa-principal/circle-marker';

export const ProyectosMinerosLayer = () => {
  const { data: proyectosMineros } = useProyectosMineros();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!proyectosMineros) {
    return null;
  }

  return (
    <>
      {proyectosMineros.map((proyectoMinero, index) => (
        <CircleMarker
          key={proyectoMinero.id}
          position={[proyectoMinero.coordenadasGeograficas[1], proyectoMinero.coordenadasGeograficas[0]]}
          value={index + 1}
          title={`Proyecto: ${proyectoMinero.nombre}`}
          color={proyectoMinero.tipo.color as MarkerColor}
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
