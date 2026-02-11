import { semanticColors } from '@heroui/react';
import { GeoJSON } from 'react-leaflet';
import { useCapaDepartamentos } from '@/departamentos/use-capa-departamentos';

export const CapaDepartamentos = () => {
  const { data } = useCapaDepartamentos();

  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      data={data}
      pathOptions={{
        color: semanticColors.light.default[500],
        fillColor: semanticColors.light.default[500],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
