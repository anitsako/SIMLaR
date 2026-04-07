import { Select, SelectItem } from '@heroui/react';
import { useEffect, useRef } from 'react';
import { Circle, Hexagon, Pentagon, Square, Triangle } from 'lucide-react';
import { useProyectosMinerosTipos } from './use-proyectos-mineros-tipos';
import type { ReactNode } from 'react';

export const ProyectoMineroTiposField = ({
  ids,
  required,
  onChange,
}: {
  ids: Array<number>;
  required?: boolean;
  onChange: (ids: Array<number>) => void;
}) => {
  const { data: proyectosMinerosTipos, isFetching } = useProyectosMinerosTipos();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && proyectosMinerosTipos.length > 0) {
      initialized.current = true;
      onChange(proyectosMinerosTipos.map((t) => t.id));
    }
  }, [proyectosMinerosTipos]);

  const shape: Record<string, ReactNode> = {
    circle: <Circle />,
    triangle: <Triangle />,
    square: <Square />,
    rombus: <Square style={{ transform: 'rotate(45deg)' }} />,
    pentagon: <Pentagon />,
    hexagon: <Hexagon />,
  };

  return (
    <Select
      label="Tipos de proyecto minero"
      isLoading={isFetching}
      isRequired={required}
      selectionMode="multiple"
      selectedKeys={ids.map(String)}
      onSelectionChange={(keys) => onChange(Array.from(keys as Set<string>).map(Number))}
    >
      {proyectosMinerosTipos.map((tipo) => (
        <SelectItem key={tipo.id} startContent={shape[tipo.forma!]}>
          {tipo.nombre}
        </SelectItem>
      ))}
    </Select>
  );
};
