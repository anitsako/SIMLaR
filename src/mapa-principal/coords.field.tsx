import { Button, useDisclosure } from '@heroui/react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { DmsCordsModal } from './dms-coords.modal';
import { decimalToDms } from '@/common/decimal-to-dms';
import { CapaDepartamentos } from '@/departamentos/capa-departamentos';

// Icono personalizado para el marker
const customIcon = L.icon({
  iconUrl: '/markers/marker-icon.png',
  iconRetinaUrl: '/markers/marker-icon-2x.png',
  shadowUrl: '/markers/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const CoordsField = ({
  value,
  onValueChange,
}: {
  value: { lat: number; lng: number };
  onValueChange: (coords: { lat: number; lng: number }) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Coordenadas geográficas</p>
        <Button size="sm" variant="flat" onPress={onOpen}>
          Ingresar manualmente
        </Button>
      </div>
      <p className="text-xs text-gray-500">Arrastre el marcador para seleccionar la ubicación.</p>
      <div className="h-128 rounded-lg overflow-hidden border border-gray-300 relative z-0">
        <MapContainer center={[-29.8135, -66.8558]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <CapaDepartamentos />
          <Marker
            draggable
            position={[value.lat, value.lng]}
            icon={customIcon}
            eventHandlers={{
              drag(e) {
                const { lat, lng } = e.target.getLatLng();
                onValueChange({ lat, lng });
              },
            }}
          />
        </MapContainer>
      </div>
      <p className="text-sm">
        <span className="font-medium">Lat:</span> {decimalToDms(value.lat, true)} &nbsp;
        <span className="font-medium">Lng:</span> {decimalToDms(value.lng, false)}
      </p>
      {isOpen && <DmsCordsModal value={value} isOpen={isOpen} onClose={onClose} onValueChange={onValueChange} />}
    </div>
  );
};
