// import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
// import { Construction } from 'lucide-react';
import TablaProyectos from '@/tabla-proyectos/tabla';

export const Route = createFileRoute('/proyectos-mineros/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4">
        <p className='text-3xl mb-4 font-bold text-center'>
          Proyectos Mineros 
        </p>
        <TablaProyectos />
      </div>
    </>
  );
}
