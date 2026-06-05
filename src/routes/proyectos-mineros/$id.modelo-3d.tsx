import { lazy, Suspense } from 'react';
import { ClientOnly, createFileRoute, useParams, Link } from '@tanstack/react-router';
import { Button, Spinner } from '@heroui/react';
import { useModeloTerrenoFn } from '@/modelos-terreno/use-modelo-terreno';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/proyectos-mineros/$id/modelo-3d')({
  component: RouteComponent,
});

// Carga diferida del visor (solo en el navegador)
const VisorTerreno3D = lazy(() =>
  import('@/modelos-terreno/visor-terreno-3d').then((m) => ({ default: m.VisorTerreno3D })),
);

function RouteComponent() {
  const { id } = useParams({ from: '/proyectos-mineros/$id/modelo-3d' });
  const proyectoId = Number(id);

  const { data: modelo, isLoading } = useModeloTerrenoFn(proyectoId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner label="Cargando modelo de terreno..." />
      </div>
    );
  }

  // Para 3D necesitamos mdtRaw + ortofotoPng (la decisión "simple")
  const tieneArchivos3D = modelo?.mdtRaw && modelo?.ortofotoPng;

  if (!modelo || !tieneArchivos3D) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <SectionTitle title="Este proyecto no tiene modelo 3D disponible" />
        <p className="text-sm text-default-500 max-w-md text-center">
          Para visualizar en 3D, el proyecto debe tener cargado el MDT raw y la ortofoto PNG.
        </p>
        <Button as={Link} to="/proyectos-mineros" color="primary">
          Volver a proyectos
        </Button>
      </div>
    );
  }

  return (
    <ClientOnly>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spinner label="Cargando visor 3D..." />
          </div>
        }
      >
        <VisorTerreno3D modelo={modelo} />
      </Suspense>
    </ClientOnly>
  );
}
