import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';

export const Route = createFileRoute('/proyectos-mineros/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-5xl font-bold text-center">Proyectos mineros</p>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Mapa interactivo</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Listado general</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Prospección</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Exploración</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Desarrollo</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
    </>
  );
}
