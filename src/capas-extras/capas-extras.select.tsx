import { Button, Select, SelectItem } from '@heroui/react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type CapasExtrasSelectProps = {
  capasExtras: Array<string>;
  setCapasExtras: (value: Array<string>) => void;
};

export const CapasExtrasSelect = ({ capasExtras, setCapasExtras }: CapasExtrasSelectProps) => {
  const capasExtrasItems = [
    { key: 'aeropuertos', textValue: 'routes.inicio.mapa.capas.aeropuertos', href: '/capas-extras/aeropuertos.zip' },
    { key: 'areas-protegidas', textValue: 'routes.inicio.mapa.capas.areasProtegidas', href: '/capas-extras/areas-protegidas.zip' },
    { key: 'cerros', textValue: 'routes.inicio.mapa.capas.cerros', href: '/capas-extras/cerros.zip' },
    { key: 'diques', textValue: 'routes.inicio.mapa.capas.diques', href: '/capas-extras/diques.zip' },
    { key: 'puntos-extras', textValue: 'routes.inicio.mapa.capas.puntosExtras', href: '/capas-extras/puntos-extras.zip' },
    { key: 'refugios', textValue: 'routes.inicio.mapa.capas.refugios', href: '/capas-extras/refugios.zip' },
    { key: 'rios-intermitentes', textValue: 'routes.inicio.mapa.capas.riosIntermitentes', href: '/capas-extras/rios-intermitentes.zip' },
    { key: 'rios-perennes', textValue: 'routes.inicio.mapa.capas.riosPerennes', href: '/capas-extras/rios-perennes.zip' },
    { key: 'rutas-nacionales', textValue: 'routes.inicio.mapa.capas.rutasNacionales', href: '/capas-extras/rutas-nacionales.zip' },
    { key: 'rutas-provinciales', textValue: 'routes.inicio.mapa.capas.rutasProvinciales', href: '/capas-extras/rutas-provinciales.zip' },
    { key: 'servidumbres', textValue: 'routes.inicio.mapa.capas.servidumbres', href: '/capas-extras/servidumbres.zip' },
  ];

  const DownloadButton = ({ href }: { href: string }) => (
    <Button as="a" isIconOnly title={t('routes.inicio.mapa.descargarCapa')} size="sm" variant="light" color="primary" href={href}>
      <Download size={16} />
    </Button>
  );

  const { t } = useTranslation();

  return (
    <Select
      label={t("routes.inicio.mapa.capasExtra")}
      selectionMode="multiple"
      isVirtualized
      maxListboxHeight={300}
      selectedKeys={capasExtras.map(String)}
      onSelectionChange={(keys) => setCapasExtras(Array.from(keys as Set<string>).map(String))}
    >
      {capasExtrasItems.map((item) => (
        <SelectItem key={item.key} textValue={t(item.textValue)}>
          <div className="flex w-full items-center justify-between gap-2">
            <span>{t(item.textValue)}</span>
            <DownloadButton href={item.href} />
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};
