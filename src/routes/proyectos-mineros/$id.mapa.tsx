import { lazy, Suspense } from 'react';
import { ClientOnly, createFileRoute, useParams, Link } from '@tanstack/react-router';
import { Button, Spinner } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useModeloTerrenoFn } from '@/modelos-terreno/use-modelo-terreno';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/proyectos-mineros/$id/mapa')({
  component: RouteComponent,
});

// Carga diferida: el archivo del mapa (con maplibre) solo se importa en el navegador
const MapaTerreno = lazy(() => import('@/modelos-terreno/mapa-terreno').then((m) => ({ default: m.MapaTerreno })));

function RouteComponent() {
  const { t } = useTranslation();
  const { id } = useParams({ from: '/proyectos-mineros/$id/mapa' });
  const proyectoId = Number(id);

  const { data: modelo, isLoading } = useModeloTerrenoFn(proyectoId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner label={t('routes.proyectosMineros.mapa.cargandoModelo')} />
      </div>
    );
  }
  if (!modelo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <SectionTitle title={t('routes.proyectosMineros.mapa.sinModelo')} />
        <Button as={Link} to="/" color="primary">
          {t('routes.proyectosMineros.mapa.volverInicio')}
        </Button>
      </div>
    );
  }

  return (
    <ClientOnly>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spinner label={t('routes.proyectosMineros.mapa.cargandoMapa')} />
          </div>
        }
      >
        <MapaTerreno modelo={modelo} />
      </Suspense>
    </ClientOnly>
  );
}
