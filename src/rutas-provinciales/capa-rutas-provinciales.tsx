import { commonColors } from '@heroui/react';
import { GeoJSON } from 'react-leaflet';
import { useCapaRutasProvinciales } from './use-capa-rutas-provinciales';

export const CapaRutasProvinciales = () => {
  const { data } = useCapaRutasProvinciales();

  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      data={data}
      pathOptions={{
        color: commonColors.purple[300],
        fillColor: commonColors.purple[300],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
