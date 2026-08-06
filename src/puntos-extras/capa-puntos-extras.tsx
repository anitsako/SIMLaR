import { useState } from 'react';
import { commonColors } from '@heroui/react';
import L from 'leaflet';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useCapaPuntosExtras } from './use-capa-puntos-extras';

const customIcon = L.icon({
  iconUrl: '/markers/marker-icon-orange.png',
  iconRetinaUrl: '/markers/marker-icon-2x-orange.png',
  shadowUrl: '/markers/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const CapaPuntosExtras = () => {
  const { data } = useCapaPuntosExtras();
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
      key={`puntos-extras-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
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
        // opacity: 0.7,
        // fillOpacity: 0.3,
      }}
    />
  );
};
