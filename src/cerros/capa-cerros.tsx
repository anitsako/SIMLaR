import { useState } from 'react';
import { commonColors } from '@heroui/react';
import L from 'leaflet';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useCapaCerros } from './use-capa-cerros';
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'

const customIcon = L.icon({
  iconUrl: '/markers/marker-icon-gold.png',
  iconRetinaUrl: '/markers/marker-icon-2x-gold.png',
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
  const mostrarTooltip = zoomActual > 9;

  if (!data) {
    return null;
  }

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={80}
      spiderfyOnMaxZoom={true}
      polygonOptions={{
        fillColor: '#ffffff',
        color: 'green',
        weight: 2,
        opacity: 0.4,
        fillOpacity: 0.5,
      }}
      showCoverageOnHover={true}
      animate={true}
    >

      <GeoJSON
        key={`cerros-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
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
    </MarkerClusterGroup >

  );
};
