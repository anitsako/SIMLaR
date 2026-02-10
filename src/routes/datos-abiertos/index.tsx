import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';

export const Route = createFileRoute('/datos-abiertos/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-5xl font-bold text-center">Datos abiertos</p>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Información minera general</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Sección de aprendizaje</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Datasets mineros</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Estadísticas del sector</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Informes técnicos consolidados</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Producción minera</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
    </>
  );
}
