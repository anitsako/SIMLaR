import { Select, SelectItem } from '@heroui/react';

type CapasExtrasSelectProps = {
  capasExtras: Array<string>;
  setCapasExtras: (value: Array<string>) => void;
};

export const CapasExtrasSelect = ({ capasExtras, setCapasExtras }: CapasExtrasSelectProps) => {
  return (
    <Select
      label="Capas extras"
      selectionMode="multiple"
      selectedKeys={capasExtras.map(String)}
      onSelectionChange={(keys) => setCapasExtras(Array.from(keys as Set<string>).map(String))}
    >
      <SelectItem key="aeropuertos">Aeropuertos</SelectItem>
      <SelectItem key="diques">Diques</SelectItem>
      <SelectItem key="rios">Ríos</SelectItem>
      <SelectItem key="rutas-nacionales">Rutas nacionales</SelectItem>
      <SelectItem key="rutas-provinciales">Rutas provinciales</SelectItem>
    </Select>
  );
};
