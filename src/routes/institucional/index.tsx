import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';

export const Route = createFileRoute('/institucional/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-5xl font-bold text-center">Institucional</p>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Autoridades</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Objetivos y alcance de SIMLaR</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Organismos vinculados</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
    </>
  );
}
