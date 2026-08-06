import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { CapaDepartamentos } from '@/departamentos/capa-departamentos';
import { ProyectosMinerosLayer } from '@/proyectos-mineros/proyectos-mineros.layer';
import { ProyectoMineroTiposField } from '@/proyectos-mineros-tipos/proyecto-minero-tipos.field';
import { ProyectoMineroEtapasField } from '@/proyectos-mineros-etapas/proyecto-minero-etapas.field';
import { CapaAeropuertos } from '@/aeropuertos/capa-aeropuertos';
import { CapaDiques } from '@/diques/capa-diques';
import { CapaCerros } from '@/cerros/capa-cerros';
import { CapaRutasNacionales } from '@/rutas-nacionales/capa-rutas-nacionales';
import { CapaRutasProvinciales } from '@/rutas-provinciales/capa-rutas-provinciales';
import { CapasExtrasSelect } from '@/capas-extras/capas-extras.select';
import { CapaRefugios } from '@/refugios/capa-refugios';
import { CapaPuntosExtras } from '@/puntos-extras/capa-puntos-extras';
import { CapaRiosPerennes } from '@/rios-perennes/capa-rios-perennes';
import { CapaRiosIntermitentes } from '@/rios-intermitentes/capa-rios-intermitentes';
import { CapaServidumbres } from '@/servidumbres/capa-servidumbres';

export const MapaPrincipal = () => {
  const [etapasIds, setEtapasIds] = useState<Array<number>>([]);
  const [tiposIds, setTiposIds] = useState<Array<number>>([]);
  const [capasExtras, setCapasExtras] = useState<Array<string>>([]);

  return (
    <>
      <div className="flex flex-row gap-2 mb-2">
        <ProyectoMineroEtapasField ids={etapasIds} onChange={setEtapasIds} />
        <ProyectoMineroTiposField ids={tiposIds} onChange={setTiposIds} />
        <CapasExtrasSelect capasExtras={capasExtras} setCapasExtras={setCapasExtras} />
      </div>
      <div className="w-full h-[550px] relative z-0">
        <MapContainer
          bounds={[
            [-27.5647, -69.7471],
            [-32.0868, -65.264],
          ]}
          style={{ height: '100%', width: '100%' }}
          maxZoom={17}
          zoomSnap={0}
          zoomDelta={0.25}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <CapaDepartamentos />
          {capasExtras.includes('aeropuertos') && <CapaAeropuertos />}
          {capasExtras.includes('diques') && <CapaDiques />}
          {capasExtras.includes('cerros') && <CapaCerros />}
          {capasExtras.includes('puntos-extras') && <CapaPuntosExtras />}
          {capasExtras.includes('refugios') && <CapaRefugios />}
          {capasExtras.includes('rios-intermitentes') && <CapaRiosIntermitentes />}
          {capasExtras.includes('rios-perennes') && <CapaRiosPerennes />}
          {capasExtras.includes('rutas-nacionales') && <CapaRutasNacionales />}
          {capasExtras.includes('rutas-provinciales') && <CapaRutasProvinciales />}
          {capasExtras.includes('servidumbres') && <CapaServidumbres />}
          <ProyectosMinerosLayer etapasIds={etapasIds} tiposIds={tiposIds} />
        </MapContainer>
      </div>
    </>
  );
};
