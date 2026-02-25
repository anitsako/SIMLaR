import { createFileRoute } from '@tanstack/react-router';
import { ProyectosMinerosTable } from '@/proyectos-mineros/proyectos-mineros.table';

export const Route = createFileRoute('/proyectos-mineros/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl mb-4 font-bold text-center">Proyectos Mineros</p>
        <ProyectosMinerosTable />
      </div>
    </>
  );
}
