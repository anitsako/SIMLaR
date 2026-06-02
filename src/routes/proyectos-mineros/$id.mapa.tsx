import { lazy, Suspense } from 'react';
import { ClientOnly, createFileRoute, useParams, Link } from '@tanstack/react-router';
import { Button, Spinner } from '@heroui/react';
import { useModeloTerrenoFn } from '@/modelos-terreno/use-modelo-terreno';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/proyectos-mineros/$id/mapa')({
  component: RouteComponent,
});

// Carga diferida: el archivo del mapa (con maplibre) solo se importa en el navegador
const MapaTerreno = lazy(() => import('@/modelos-terreno/mapa-terreno').then((m) => ({ default: m.MapaTerreno })));

function RouteComponent() {
  const { id } = useParams({ from: '/proyectos-mineros/$id/mapa' });
  const proyectoId = Number(id);

  const { data: modelo, isLoading } = useModeloTerrenoFn(proyectoId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner label="Cargando modelo de terreno..." />
      </div>
    );
  }

  if (!modelo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <SectionTitle title="Este proyecto no tiene modelo de terreno" />
        <Button as={Link} to="/" color="primary">
          Volver a Inicio
        </Button>
      </div>
    );
  }

  return (
    <ClientOnly>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spinner label="Cargando mapa..." />
          </div>
        }
      >
        <MapaTerreno modelo={modelo} />
      </Suspense>
    </ClientOnly>
  );
}
