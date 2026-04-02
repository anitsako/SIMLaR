import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { Select, SelectItem } from '@heroui/react';
import { CapaDepartamentos } from '@/departamentos/capa-departamentos';
import { ProyectosMinerosLayer } from '@/proyectos-mineros/proyectos-mineros.layer';
import { ProyectoMineroTiposField } from '@/proyectos-mineros-tipos/proyecto-minero-tipos.field';
import { ProyectoMineroEtapasField } from '@/proyectos-mineros-etapas/proyecto-minero-etapas.field';
import { CapaRutasNacionales } from '@/rutas-nacionales/capa-rutas-nacionales';
import { CapaRutasProvinciales } from '@/rutas-provinciales/capa-rutas-provinciales';

export const MapaPrincipal = () => {
  const [etapasIds, setEtapasIds] = useState<Array<number>>([]);
  const [tiposIds, setTiposIds] = useState<Array<number>>([]);
  const [capasExtras, setCapasExtras] = useState<Array<string>>([]);

  return (
    <>
      <div className="flex flex-row gap-2 mb-2">
        <ProyectoMineroEtapasField ids={etapasIds} onChange={setEtapasIds} />
        <ProyectoMineroTiposField ids={tiposIds} onChange={setTiposIds} />
        <Select
          label="Capas extras"
          selectionMode="multiple"
          selectedKeys={capasExtras.map(String)}
          onSelectionChange={(keys) => setCapasExtras(Array.from(keys as Set<string>).map(String))}
        >
          <SelectItem key="rutas-nacionales">Rutas nacionales</SelectItem>
          <SelectItem key="rutas-provinciales">Rutas provinciales</SelectItem>
        </Select>
      </div>
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
          {capasExtras.includes('rutas-nacionales') && <CapaRutasNacionales />}
          {capasExtras.includes('rutas-provinciales') && <CapaRutasProvinciales />}
          <ProyectosMinerosLayer etapasIds={etapasIds} tiposIds={tiposIds} />
        </MapContainer>
      </div>
    </>
  );
};
