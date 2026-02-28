import { Link, createFileRoute } from '@tanstack/react-router';
import { Button } from '@heroui/react';
import { ProyectosMinerosTable } from '@/proyectos-mineros/proyectos-mineros.table';

export const Route = createFileRoute('/proyectos-mineros/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-center mb-4 relative">
        <p className="text-3xl font-bold text-center">Proyectos Mineros</p>
        <Button className="absolute right-0" as={Link} to="/proyectos-mineros/crear" color="primary" size="sm">
          Crear proyecto
        </Button>
      </div>
      <ProyectosMinerosTable />
    </div>
  );
}
