import { commonColors } from '@heroui/react';
import { GeoJSON } from 'react-leaflet';
import { useCapaRutasNacionales } from './use-capa-rutas-nacionales';

export const CapaRutasNacionales = () => {
  const { data } = useCapaRutasNacionales();

  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      data={data}
      pathOptions={{
        color: commonColors.purple[500],
        fillColor: commonColors.purple[500],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
