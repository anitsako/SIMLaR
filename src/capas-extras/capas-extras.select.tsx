import { Button, Select, SelectItem } from '@heroui/react';
import { Download } from 'lucide-react';

type CapasExtrasSelectProps = {
  capasExtras: Array<string>;
  setCapasExtras: (value: Array<string>) => void;
};

export const CapasExtrasSelect = ({ capasExtras, setCapasExtras }: CapasExtrasSelectProps) => {
  const DownloadButton = ({ href }: { href: string }) => (
    <Button as="a" isIconOnly title="Descargar capa" size="sm" variant="light" color="primary" href={href}>
      <Download size={16} />
    </Button>
  );

  return (
    <Select
      label="Capas extras"
      selectionMode="multiple"
      selectedKeys={capasExtras.map(String)}
      onSelectionChange={(keys) => setCapasExtras(Array.from(keys as Set<string>).map(String))}
    >
      <SelectItem key="aeropuertos" textValue="Aeropuertos">
        <div className="flex w-full items-center justify-between gap-2">
          <span>Aeropuertos</span>
          <DownloadButton href="/capas-extras/aeropuertos.zip" />
        </div>
      </SelectItem>
      <SelectItem key="diques" textValue="Diques">
        <div className="flex w-full items-center justify-between gap-2">
          <span>Diques</span>
          <DownloadButton href="/capas-extras/diques.zip" />
        </div>
      </SelectItem>
      <SelectItem key="rios" textValue="Ríos">
        <div className="flex w-full items-center justify-between gap-2">
          <span>Ríos</span>
          <DownloadButton href="/capas-extras/rios.zip" />
        </div>
      </SelectItem>
      <SelectItem key="rutas-nacionales" textValue="Rutas nacionales">
        <div className="flex w-full items-center justify-between gap-2">
          <span>Rutas nacionales</span>
          <DownloadButton href="/capas-extras/rutas-nacionales.zip" />
        </div>
      </SelectItem>
      <SelectItem key="rutas-provinciales" textValue="Rutas provinciales">
        <div className="flex w-full items-center justify-between gap-2">
          <span>Rutas provinciales</span>
          <DownloadButton href="/capas-extras/rutas-provinciales.zip" />
        </div>
      </SelectItem>
    </Select>
  );
};
