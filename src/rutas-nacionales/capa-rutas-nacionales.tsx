import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { useCapaRutasNacionales } from './use-capa-rutas-nacionales';

export const CapaRutasNacionales = () => {
  const { data } = useCapaRutasNacionales();
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
      key={`rutas-nacionales-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(nombre, { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.white,
        fillColor: commonColors.white,
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
