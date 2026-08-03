import { useState } from 'react';
import { commonColors } from '@heroui/react';
import L from 'leaflet';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useCapaCerros } from './use-capa-cerros';

const customIcon = L.icon({
  iconUrl: '/markers/marker-icon.png',
  iconRetinaUrl: '/markers/marker-icon-gold.png',
  shadowUrl: '/markers/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const CapaCerros = () => {
  const { data } = useCapaCerros();
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
      pointToLayer={(_, latlng) => L.marker(latlng, { icon: customIcon })}
      pathOptions={{
        color: commonColors.zinc[500],
        fillColor: commonColors.zinc[500],
      }}
    />
  );
};
