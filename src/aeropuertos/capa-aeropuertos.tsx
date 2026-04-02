import { useState } from 'react';
import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useCapaDiques } from './use-capa-aeropuertos';

export const CapaAeropuertos = () => {
  const { data } = useCapaDiques();
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
      key={`aeropuertos-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(nombre, { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.zinc[500],
        fillColor: commonColors.zinc[500],
        // opacity: 0.7,
        // fillOpacity: 0.3,
      }}
    />
  );
};
