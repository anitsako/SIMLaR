import { createFileRoute } from '@tanstack/react-router';
import { Alert } from '@heroui/react';
import { Construction } from 'lucide-react';
import { AppBar } from '@/common/app-bar';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center gap-2">
      <div className="max-w-6xl w-full">
        <AppBar />
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Carrousel de imágenes en construccion
        </Alert>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Mapa satelital de proyectos en construccion
        </Alert>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Sección de noticias destacadas en construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Sección de accesos rápidos en construcción
        </Alert>
      </div>
    </div>
  );
}
