import { Select, SelectItem } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useProyectosMinerosTipos } from './use-proyectos-mineros-tipos';

export const ProyectoMineroTipoField = ({
  id,
  required,
  onChange,
}: {
  id: number | undefined;
  required?: boolean;
  onChange: (id: number | undefined) => void;
}) => {
  const { t } = useTranslation();
  const { data: proyectosMinerosTipos, isFetching } = useProyectosMinerosTipos();

  return (
    <Select
      label={t('routes.admin.proyectosMineros.form.tipo')}
      isLoading={isFetching}
      isRequired={required}
      selectedKeys={id ? [id.toString()] : []}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
    >
      {proyectosMinerosTipos.map((tipo) => (
        <SelectItem key={tipo.id}>{tipo.nombre}</SelectItem>
      ))}
    </Select>
  );
};
