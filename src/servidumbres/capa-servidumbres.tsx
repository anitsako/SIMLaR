import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { useCapaServidumbres } from './use-capa-servidumbres';

export const CapaServidumbres = () => {
  const { data } = useCapaServidumbres();
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
      key={`servidumbres-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(nombre, { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.yellow[200],
        fillColor: commonColors.yellow[200],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
