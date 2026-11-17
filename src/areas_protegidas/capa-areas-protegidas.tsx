
import { useState } from 'react';
import { commonColors } from '@heroui/react';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { useCapaAreasProtegidas } from './use-capa-areas-protegidas.ts';

export const CapaAreasProtegidas = () => {
  const { t } = useTranslation();
  const { data } = useCapaAreasProtegidas();
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
      key={`areas-protegidas-${mostrarTooltip ? 'tooltip-on' : 'tooltip-off'}`}
      data={data}
      onEachFeature={(feature, layer) => {
        const nombre = feature.properties?.nombre;
        if (nombre && mostrarTooltip) {
          layer.bindTooltip(t('routes.inicio.mapa.tooltips.areaProtegida', { nombre }), { direction: 'top' });
        }
      }}
      pathOptions={{
        color: commonColors.green[300],
        fillColor: commonColors.green[300],
        opacity: 0.7,
        fillOpacity: 0.3,
      }}
    />
  );
};
