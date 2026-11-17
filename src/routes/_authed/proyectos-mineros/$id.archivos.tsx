import { Button } from '@heroui/react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { proyectoMineroQuery } from '@/proyectos-mineros/use-proyecto-minero';
import { ProyectoMineroArchivosManager } from '@/proyectos-mineros-archivos/proyecto-minero-archivos.manager';

export const Route = createFileRoute('/_authed/proyectos-mineros/$id/archivos')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(proyectoMineroQuery(Number(id)));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const { data: proyecto } = useSuspenseQuery(proyectoMineroQuery(Number(id)));

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('routes.admin.proyectosMineros.archivos.titulo')}</h1>
          <p className="text-sm text-default-500">{proyecto.nombre}</p>
        </div>
        <Button as={Link} to="/proyectos-mineros">
          {t('routes.admin.proyectosMineros.archivos.volver')}
        </Button>
      </div>

      <ProyectoMineroArchivosManager proyectoMineroId={Number(id)} />
    </div>
  );
}
