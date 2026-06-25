import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button, Slider } from '@heroui/react';
import maplibregl from 'maplibre-gl';
import { cogProtocol } from '@geomatico/maplibre-cog-protocol';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { getModeloTerrenoFn } from '@/modelos-terreno/get-modelo-terreno.fn';

type ModeloTerreno = Awaited<ReturnType<typeof getModeloTerrenoFn>>;

export function MapaTerreno({ modelo }: { modelo: NonNullable<ModeloTerreno> }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [orthoOpacity, setOrthoOpacity] = useState(1);
  const [coloreadoOpacity, setColoreadoOpacity] = useState(0.7);
  const [existeColoreado, setExisteColoreado] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!modelo.ortofoto) return;

    // Ahora maplibregl y cogProtocol vienen de los imports de arriba,
    // sin await import ni IIFE
    maplibregl.addProtocol('cog', cogProtocol);

    const ortofotoUrl = `cog:///archivos/${modelo.ortofoto.archivoId}/${modelo.ortofoto.nombre}`;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: 'Tiles © Esri',
          },
        },
        layers: [
          { id: 'background', type: 'background', paint: { 'background-color': '#e5e5e5' } },
          { id: 'satellite', type: 'raster', source: 'satellite', paint: { 'raster-fade-duration': 0 } },
        ],
      },
      center: [modelo.center.lon, modelo.center.lat],
      zoom: modelo.defaultZoom ?? 14,
      maxZoom: 16.3,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addSource('ortho', {
        type: 'raster',
        url: ortofotoUrl,
        tileSize: 256,
        minzoom: 0,
      });

      map.addLayer({
        id: 'ortho-layer',
        type: 'raster',
        source: 'ortho',
        minzoom: 13,
        paint: {
          'raster-opacity': 1,
          'raster-fade-duration': 0,
          'raster-resampling': 'linear',
        },
      });

      if (modelo.mdtColoreado) {
        setExisteColoreado(true);
        const coloreadoUrl = `cog:///archivos/${modelo.mdtColoreado.archivoId}/${modelo.mdtColoreado.nombre}`;

        map.addSource('dtm-coloreado', {
          type: 'raster',
          url: coloreadoUrl,
          tileSize: 256,
          minzoom: 0,
        });

        map.addLayer({
          id: 'dtm-coloreado-layer',
          type: 'raster',
          source: 'dtm-coloreado',
          minzoom: 13,
          paint: {
            'raster-opacity': 0.7,
            'raster-fade-duration': 0,
            'raster-resampling': 'linear',
          },
        });
      }
    });

    map.once('idle', () => {
      if (modelo.bounds.west != null) {
        map.fitBounds(
          [
            [modelo.bounds.west, modelo.bounds.south],
            [modelo.bounds.east, modelo.bounds.north],
          ],
          { padding: 40, duration: 800 },
        );
      }
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    return () => {
      map.remove();
      maplibregl.removeProtocol('cog');
      mapRef.current = null;
    };
  }, [modelo]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('ortho-layer')) return;
    map.setPaintProperty('ortho-layer', 'raster-opacity', orthoOpacity);
  }, [orthoOpacity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('dtm-coloreado-layer')) return;
    map.setPaintProperty('dtm-coloreado-layer', 'raster-opacity', coloreadoOpacity);
  }, [coloreadoOpacity]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-xl font-semibold">{modelo.nombre}</h1>
        <Button as={Link} to="/proyectos-mineros" size="sm" variant="flat">
          Volver
        </Button>
      </header>

      <div className="flex flex-row flex-1 gap-4 px-4 pb-4 overflow-hidden mt-4">
        <div ref={mapContainer} className="flex-1 h-full rounded-md overflow-hidden" />

        <div className="flex items-center justify-center w-24 h-full">
          <Slider
            className="h-1/2"
            step={0.01}
            minValue={0}
            maxValue={1}
            label="Opacidad"
            orientation="vertical"
            value={orthoOpacity}
            onChange={(v) => setOrthoOpacity(Array.isArray(v) ? v[0] : v)}
          />
        </div>
        {existeColoreado && (
          <div className="flex items-center justify-center w-24 h-full">
            <Slider
              className="h-1/2"
              step={0.01}
              minValue={0}
              maxValue={1}
              label="Opacidad DTM"
              orientation="vertical"
              value={coloreadoOpacity}
              onChange={(v) => setColoreadoOpacity(Array.isArray(v) ? v[0] : v)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
