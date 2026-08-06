import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

interface ServicioContactoMapProps {
  nombre: string;
  latitud: number;
  longitud: number;
  className?: string;
}

export function ServicioContactoMap({
  nombre,
  latitud,
  longitud,
  className = 'h-64',
}: ServicioContactoMapProps) {
  return (
    <div
      className={[
        'w-full overflow-hidden rounded-xl border border-default-200',
        className,
      ].join(' ')}
    >
      <MapContainer
        center={[latitud, longitud]}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[latitud, longitud]}
          radius={9}
          pathOptions={{
            color: '#b91c1c',
            fillColor: '#dc2626',
            fillOpacity: 0.9,
          }}
        >
          <Popup>{nombre}</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}

interface SelectorUbicacionProps {
  latitud: number;
  longitud: number;
  onChange: (coordenadas: {
    latitud: number;
    longitud: number;
  }) => void;
}

function CapturarClick({
  onChange,
}: Pick<SelectorUbicacionProps, 'onChange'>) {
  useMapEvents({
    click(evento) {
      onChange({
        latitud: Number(evento.latlng.lat.toFixed(6)),
        longitud: Number(evento.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

export function SelectorUbicacionServicio({
  latitud,
  longitud,
  onChange,
}: SelectorUbicacionProps) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-xl border border-default-200">
      <MapContainer
        key={`${latitud}-${longitud}`}
        center={[latitud, longitud]}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CapturarClick onChange={onChange} />

        <CircleMarker
          center={[latitud, longitud]}
          radius={9}
          pathOptions={{
            color: '#b91c1c',
            fillColor: '#dc2626',
            fillOpacity: 0.9,
          }}
        />
      </MapContainer>
    </div>
  );
}
