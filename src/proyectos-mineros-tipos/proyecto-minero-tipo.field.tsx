import { Select, SelectItem } from '@heroui/react';
import { useProyectosMinerosTipos } from './use-proyectos-mineros-tipos';

export const ProyectoMineroTipoField = ({
  id,
  onChange,
}: {
  id: number | undefined;
  onChange: (id: number | undefined) => void;
}) => {
  const { data: proyectosMinerosTipos, isFetching } = useProyectosMinerosTipos();

  return (
    <Select
      label="Tipo de proyecto minero"
      isLoading={isFetching}
      value={id}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
    >
      {proyectosMinerosTipos.map((tipo) => (
        <SelectItem key={tipo.id}>{tipo.nombre}</SelectItem>
      ))}
    </Select>
  );
};
