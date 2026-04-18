import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';
import { Alert } from '@heroui/react';

export const Route = createFileRoute('/educacion/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-6xl w-full mt-4 space-y-6">
      <h1 className="text-5xl font-bold flex justify-center">Educación minera</h1>
      <Alert icon={<Construction />} color="warning">
        En construcción
      </Alert>
    </div>
  );
}
