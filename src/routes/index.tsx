import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Alert } from '@heroui/react';
import { Construction } from 'lucide-react';
import { MapaPrincipal } from '@/mapa-principal/mapa-principal';
import { FeaturedNews } from './noticias/NoticiasDestacadas'
import { Carrousel } from '@/carrousel-imagenes/carrousel';


export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <>
      <div className="max-w-6xl w-full">
        <Carrousel />
      </div>
      <div className="max-w-6xl w-full">
        <ClientOnly>
          <MapaPrincipal />
        </ClientOnly>
      </div>
      <div className="max-w-6xl w-full">
        <FeaturedNews />
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Sección de accesos rápidos en construcción
        </Alert>
      </div>
    </>
  );
}
