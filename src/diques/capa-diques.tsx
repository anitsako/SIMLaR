import { useState } from 'react';
import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useCapaDiques } from './use-capa-diques';

export const CapaDiques = () => {
  const { data } = useCapaDiques();
  const [zoom, setZoom] = useState<number | null>(null);
  const map = useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const zoomActual = zoom ?? map.getZoom();
  const mostrarTooltip = zoomActual > 8;

  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      key={`diques-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(`Dique: ${nombre}`, { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.blue[300],
        fillColor: commonColors.blue[300],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
