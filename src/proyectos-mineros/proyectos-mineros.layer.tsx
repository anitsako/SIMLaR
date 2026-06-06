import { useDisclosure } from '@heroui/react';
import { useState } from 'react';
import { ProyectoMineroModal } from './proyecto-minero.modal';
import { useProyectosMineros } from './use-proyectos-mineros';
import type { MarkerColor, MarkerShape } from '@/mapa-principal/main-marker';
import { MainMarker } from '@/mapa-principal/main-marker';

export const ProyectosMinerosLayer = ({
  tiposIds,
  etapasIds,
}: {
  tiposIds?: Array<number>;
  etapasIds?: Array<number>;
}) => {
  const { data: proyectosMineros } = useProyectosMineros({ etapasIds, tiposIds, visible: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

  return (
    <>
      {proyectosMineros.map((proyectoMinero) => (
        <MainMarker
          key={proyectoMinero.id}
          position={[proyectoMinero.coordenadasGeograficas[1], proyectoMinero.coordenadasGeograficas[0]]}
          value={proyectoMinero.id}
          title={`Proyecto: ${proyectoMinero.nombre}`}
          color={proyectoMinero.etapa.color as MarkerColor}
          shape={proyectoMinero.tipo.forma as MarkerShape}
          isTooltipActive={activeTooltipId === proyectoMinero.id}
          onClick={() => {
            setSelectedId(proyectoMinero.id);
            onOpen();
          }}
          onMouseOver={() => {
            setActiveTooltipId(proyectoMinero.id);
          }}
          onMouseOut={() => {
            setActiveTooltipId((currentId) => (currentId === proyectoMinero.id ? null : currentId));
          }}
        />
      ))}
      <ProyectoMineroModal id={selectedId} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
