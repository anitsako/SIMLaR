import { semanticColors, useDisclosure } from '@heroui/react';
import { useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { DepartamentoModal } from './departamento.modal';
import { useCapaDepartamentos } from '@/departamentos/use-capa-departamentos';

export const CapaDepartamentos = () => {
  const { t } = useTranslation();
  const { data } = useCapaDepartamentos();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  if (!data) {
    return null;
  }

  const capaKey = data.features
    .map((feature) => `${feature.properties?.id}:${feature.properties?.tieneImagen ? 1 : 0}`)
    .join('|');

  return (
    <>
      <GeoJSON
        key={capaKey}
        data={data}
        onEachFeature={(feature, layer) => {
          const id = feature.properties?.id?.toString();
          const nombre = feature.properties?.nombre;

          if (nombre) {
            layer.bindTooltip(t('routes.inicio.mapa.tooltips.departamento', { nombre }), { direction: 'top' });
          }

          layer.on('click', () => {
            const mostrarModal = feature.properties?.tieneImagen === true;
            setSelectedFeatureId(id);
            if (mostrarModal) {
              onOpen();
            }
          });
        }}
        style={(feature) => {
          const id = feature?.properties?.id?.toString();
          const isSelected = id === selectedFeatureId;
          const color = semanticColors.light.default[isSelected ? 700 : 500];

          return {
            className: 'departamento-feature',
            color,
            fillColor: color,
            opacity: isSelected ? 0.9 : 0.7,
            fillOpacity: isSelected ? 0.5 : 0.3,
          };
        }}
      />
      <DepartamentoModal
        id={selectedFeatureId ? parseInt(selectedFeatureId) : null}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
