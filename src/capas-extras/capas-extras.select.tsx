import { Button, Select, SelectItem } from '@heroui/react';
import { Download } from 'lucide-react';

type CapasExtrasSelectProps = {
  capasExtras: Array<string>;
  setCapasExtras: (value: Array<string>) => void;
};

export const CapasExtrasSelect = ({ capasExtras, setCapasExtras }: CapasExtrasSelectProps) => {
  const capasExtrasItems = [
    { key: 'aeropuertos', textValue: 'Aeropuertos', href: '/capas-extras/aeropuertos.zip' },
    { key: 'diques', textValue: 'Diques', href: '/capas-extras/diques.zip' },
    { key: 'puntos-extras', textValue: 'Puntos extras', href: '/capas-extras/puntos-extras.zip' },
    { key: 'refugios', textValue: 'Refugios', href: '/capas-extras/refugios.zip' },
    { key: 'rios-intermitentes', textValue: 'Ríos intermitentes', href: '/capas-extras/rios-intermitentes.zip' },
    { key: 'rios-perennes', textValue: 'Ríos perennes', href: '/capas-extras/rios-perennes.zip' },
    { key: 'rutas-nacionales', textValue: 'Rutas nacionales', href: '/capas-extras/rutas-nacionales.zip' },
    { key: 'rutas-provinciales', textValue: 'Rutas provinciales', href: '/capas-extras/rutas-provinciales.zip' },
  ];

  const DownloadButton = ({ href }: { href: string }) => (
    <Button as="a" isIconOnly title="Descargar capa" size="sm" variant="light" color="primary" href={href}>
      <Download size={16} />
    </Button>
  );

  return (
    <Select
      label="Capas extras"
      selectionMode="multiple"
      isVirtualized
      maxListboxHeight={300}
      selectedKeys={capasExtras.map(String)}
      onSelectionChange={(keys) => setCapasExtras(Array.from(keys as Set<string>).map(String))}
    >
      {capasExtrasItems.map((item) => (
        <SelectItem key={item.key} textValue={item.textValue}>
          <div className="flex w-full items-center justify-between gap-2">
            <span>{item.textValue}</span>
            <DownloadButton href={item.href} />
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};
