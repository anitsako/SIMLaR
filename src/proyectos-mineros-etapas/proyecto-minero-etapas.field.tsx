import { Select, SelectItem } from '@heroui/react';
import { useEffect, useRef } from 'react';
import { Square } from 'lucide-react';
import { useProyectosMinerosEtapas } from './use-proyectos-mineros-etapas';
import type { MarkerColor } from '@/mapa-principal/main-marker';
import { colorValues } from '@/mapa-principal/main-marker';

export const ProyectoMineroEtapasField = ({
  ids,
  required,
  onChange,
}: {
  ids: Array<number>;
  required?: boolean;
  onChange: (ids: Array<number>) => void;
}) => {
  const { data: proyectosMinerosEtapas, isFetching } = useProyectosMinerosEtapas();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && proyectosMinerosEtapas.length > 0) {
      initialized.current = true;
      onChange(proyectosMinerosEtapas.map((e) => e.id));
    }
  }, [proyectosMinerosEtapas]);

  return (
    <Select
      label="Etapas de proyecto minero"
      isLoading={isFetching}
      isRequired={required}
      selectionMode="multiple"
      selectedKeys={ids.map(String)}
      onSelectionChange={(keys) => onChange(Array.from(keys as Set<string>).map(Number))}
    >
      {proyectosMinerosEtapas.map((etapa) => (
        <SelectItem
          key={etapa.id}
          startContent={
            <Square
              fill={colorValues[etapa.color as MarkerColor].normal.fill}
              color={colorValues[etapa.color as MarkerColor].normal.fill}
            />
          }
        >
          {etapa.nombre}
        </SelectItem>
      ))}
    </Select>
  );
};
