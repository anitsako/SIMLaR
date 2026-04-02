import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { useCapaRutasProvinciales } from './use-capa-rutas-provinciales';

export const CapaRutasProvinciales = () => {
  const { data } = useCapaRutasProvinciales();
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
      key={`rutas-provinciales-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(nombre, { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.purple[300],
        fillColor: commonColors.purple[300],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
