import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CapaDepartamentos } from '@/departamentos/capa-departamentos';

export const MapaPrincipal = () => {
  return (
    <div className="w-full h-[600px] md:h-[700px]">
      <MapContainer
        center={[-29.8135, -66.8558]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <CapaDepartamentos />
      </MapContainer>
    </div>
  );
};
