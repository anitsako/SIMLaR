import { useDisclosure } from '@heroui/react';
import { useState } from 'react';
import { MetaliferoModal } from './metalifero-modal';
import { useMetaliferos } from './use-metaliferos';
import { CircleMarker } from '@/mapa-principal/circle-marker';

export const Metaliferos = () => {
  const { data: metaliferos } = useMetaliferos();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!metaliferos) {
    return null;
  }

  return (
    <>
      {metaliferos.map((metalifero, index) => (
        <CircleMarker
          key={metalifero.id}
          position={[metalifero.coordenadasGeograficas[1], metalifero.coordenadasGeograficas[0]]}
          value={index + 1}
          title={`Proyecto: ${metalifero.nombre}`}
          color="red"
          onClick={() => {
            setSelectedId(metalifero.id);
            onOpen();
          }}
        />
      ))}
      <MetaliferoModal id={selectedId} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
