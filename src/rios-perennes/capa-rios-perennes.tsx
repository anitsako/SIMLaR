import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { useCapaRiosPerennes } from './use-capa-rios-perennes';

export const CapaRiosPerennes = () => {
  const { data } = useCapaRiosPerennes();
  const [zoom, setZoom] = useState<number | null>(null);
  const map = useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const zoomActual = zoom ?? map.getZoom();
  const mostrarTooltip = zoomActual > 10;

  if (!data) {
    return null;
  }

  return (
    <GeoJSON
      key={`rios-perennes-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(nombre, { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.blue[500],
        fillColor: commonColors.blue[500],
        weight: zoomActual > 12 ? 4 : 2.5,
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
