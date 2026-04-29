import { Button } from '@heroui/react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { proyectoMineroQuery } from '@/proyectos-mineros/use-proyecto-minero';
import { ProyectoMineroArchivosManager } from '@/proyectos-mineros-archivos/proyecto-minero-archivos.manager';

export const Route = createFileRoute('/_authed/proyectos-mineros/$id/archivos')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(proyectoMineroQuery(Number(id)));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: proyecto } = useSuspenseQuery(proyectoMineroQuery(Number(id)));

  return (
    <div className="mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Archivos del proyecto minero</h1>
          <p className="text-sm text-default-500">{proyecto.nombre}</p>
        </div>
        <Button as={Link} to="/proyectos-mineros">
          Volver a proyectos
        </Button>
      </div>

      <ProyectoMineroArchivosManager proyectoMineroId={Number(id)} />
    </div>
  );
}
