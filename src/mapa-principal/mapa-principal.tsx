import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CapaDepartamentos } from '@/departamentos/capa-departamentos';
import { ProyectosMinerosLayer } from '@/proyectos-mineros/proyectos-mineros.layer';

export const MapaPrincipal = () => {
  return (
    <div className="w-full h-[500px] relative z-0">
      <MapContainer
        bounds={[
          [-27.5647, -69.7471],
          [-32.0868, -65.264],
        ]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <CapaDepartamentos />
        <ProyectosMinerosLayer />
      </MapContainer>
    </div>
  );
};
