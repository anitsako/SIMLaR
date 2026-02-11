import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Alert } from '@heroui/react';
import { Construction } from 'lucide-react';
import { MapaPrincipal } from '@/mapa-principal/mapa-principal';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Carrousel de imágenes en construccion
        </Alert>
      </div>
      <div className="max-w-6xl w-full">
        <ClientOnly>
          <MapaPrincipal />
        </ClientOnly>
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
    </>
  );
}
