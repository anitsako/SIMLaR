import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button, Slider, Spinner } from '@heroui/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { fromArrayBuffer } from 'geotiff';
import type { getModeloTerrenoFn } from '@/modelos-terreno/get-modelo-terreno.fn';

type ModeloTerreno = Awaited<ReturnType<typeof getModeloTerrenoFn>>;

interface Props {
  modelo: NonNullable<ModeloTerreno>;
}

export function VisorTerreno3D({ modelo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    terrain: THREE.Mesh | null;
    animationId: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exageracion, setExageracion] = useState(1.5);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!modelo.mdtRaw || !modelo.ortofotoPng) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Setup básico de Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.set(0, 200, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    let terrain: THREE.Mesh | null = null;
    let animationId = 0;

    // Loop de render
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { scene, renderer, camera, controls, terrain, animationId };

    // Cargar el terreno (acá va tu lógica de loadTerrain adaptada)
    const cargarTerreno = async () => {
      try {
        const mdtUrl = `/archivos/${modelo.mdtRaw!.archivoId}/${modelo.mdtRaw!.nombre}`;
        const ortofotoUrl = `/archivos/${modelo.ortofotoPng!.archivoId}/${modelo.ortofotoPng!.nombre}`;

        // 1. Cargar el MDT con geotiff.js
        const responseMdt = await fetch(mdtUrl);
        const bufferMdt = await responseMdt.arrayBuffer();
        const tiff = await fromArrayBuffer(bufferMdt);
        const image = await tiff.getImage();
        const width = image.getWidth();
        const height = image.getHeight();
        const rasters = await image.readRasters();
        const elevaciones = rasters[0] as Float32Array;

        // 2. Cargar la textura (ortofoto PNG)
        const textureLoader = new THREE.TextureLoader();
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(ortofotoUrl, resolve, undefined, reject);
        });

        // 3. Construir la geometría del terreno
        // Esquema básico:
        const geometry = new THREE.PlaneGeometry(
          width,    // ancho del plano (escalar como prefieras)
          height,   // alto
          width - 1,
          height - 1,
        );
        geometry.rotateX(-Math.PI / 2); // acostarlo horizontal

        // Aplicar alturas a los vértices
        const positions = geometry.attributes.position.array as Float32Array;
        const nodataValue = -9999; // ajustar al valor real de tu MDT

        for (let i = 0; i < elevaciones.length; i++) {
          const altura = elevaciones[i];
          if (altura !== nodataValue && !isNaN(altura)) {
            positions[i * 3 + 1] = altura * exageracion;
          } else {
            positions[i * 3 + 1] = 0;
          }
        }

        geometry.computeVertexNormals(); // para que la iluminación funcione

        // Material con la textura
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        terrain = new THREE.Mesh(geometry, material);
        scene.add(terrain);

        if (sceneRef.current) {
          sceneRef.current.terrain = terrain;
        }

        // Centrar la cámara en el terreno
        const box = new THREE.Box3().setFromObject(terrain);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        controls.target.copy(center);
        camera.position.set(center.x, center.y + size.y * 2, center.z + size.z * 1.5);

        setLoading(false);
      } catch (err) {
        console.error('Error cargando terreno:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el modelo 3D');
        setLoading(false);
      }
    };

    cargarTerreno();

    // Resize automático
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (terrain) {
        terrain.geometry.dispose();
        if (terrain.material instanceof THREE.Material) {
          terrain.material.dispose();
        }
      }
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [modelo]);

  // Actualizar exageración vertical sin recargar todo
  // useEffect(() => {
  // }, [exageracion]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-xl font-semibold">{modelo.nombre} — Vista 3D</h1>
        <Button as={Link} to="/proyectos-mineros" size="sm" variant="flat">
          Volver
        </Button>
      </header>

      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Canvas del visor 3D */}
        <div className="relative flex-1">
          <div ref={containerRef} className="w-full h-full" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <Spinner label="Cargando modelo 3D..." />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-danger">{error}</p>
            </div>
          )}
        </div>

        {/* Panel lateral con info del modelo */}
        <aside className="w-72 border-l p-4 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Información del modelo</h3>
            <dl className="text-sm space-y-1">
              {modelo.elevation.min != null && modelo.elevation.max != null && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-default-500">Elevación mín:</dt>
                    <dd>{modelo.elevation.min.toFixed(1)} m</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-default-500">Elevación máx:</dt>
                    <dd>{modelo.elevation.max.toFixed(1)} m</dd>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <dt className="text-default-500">CRS:</dt>
                <dd>{modelo.crs}</dd>
              </div>
            </dl>
          </div>

          <div>

            <p className="text-xs text-default-400 mt-2">
              Arrastrá con el mouse para rotar. Rueda para zoom. Click derecho para mover.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
