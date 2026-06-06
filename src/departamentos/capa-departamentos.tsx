import { semanticColors } from '@heroui/react';
import { useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useCapaDepartamentos } from '@/departamentos/use-capa-departamentos';

export const CapaDepartamentos = () => {
  const { data } = useCapaDepartamentos();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      data={data}
      onEachFeature={(feature, layer) => {
        const id = feature.properties?.id?.toString();
        const nombre = feature.properties?.nombre;

        if (nombre) {
          layer.bindTooltip(`Departamento: ${nombre}`, { direction: 'top' });
        }

        layer.on('click', () => {
          setSelectedFeatureId(id);
        });
      }}
      style={(feature) => {
        const id = feature?.properties?.id?.toString();
        const isSelected = id === selectedFeatureId;
        const color = semanticColors.light.default[isSelected ? 700 : 500];

        return {
          className: 'departamento-feature',
          color,
          fillColor: color,
          opacity: isSelected ? 0.9 : 0.7,
          fillOpacity: isSelected ? 0.5 : 0.3,
        };
      }}
    />
  );
};
