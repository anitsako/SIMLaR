import { Select, SelectItem } from '@heroui/react';
import { useProyectosMinerosEtapas } from './use-proyectos-mineros-etapas';

export const ProyectoMineroEtapaField = ({
  id,
  required,
  onChange,
}: {
  id: number | undefined;
  required?: boolean;
  onChange: (id: number | undefined) => void;
}) => {
  const { data: proyectosMinerosEtapas, isFetching } = useProyectosMinerosEtapas();

  return (
    <Select
      label="Etapa de proyecto minero"
      isLoading={isFetching}
      isRequired={required}
      selectedKeys={id ? [id.toString()] : []}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
    >
      {proyectosMinerosEtapas.map((etapa) => (
        <SelectItem key={etapa.id}>{etapa.nombre}</SelectItem>
      ))}
    </Select>
  );
};
