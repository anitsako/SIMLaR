import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';

export const Route = createFileRoute('/noticias/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-5xl font-bold text-center">Noticias</p>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Noticias del sector minero</p>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          En construcción
        </Alert>
      </div>
    </>
  );
}
