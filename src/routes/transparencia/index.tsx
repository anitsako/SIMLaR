import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/transparencia/')({
  component: RouteComponent,
});

const SECCIONES: Array<string> = ['Acceso a la información pública', 'Marco normativo', 'Convenios'];

function RouteComponent() {
  return (
    <div className="mt-4 w-full max-w-6xl space-y-6">
      <SectionTitle title="Transparencia" sizeTitle="5xl" textCenter />

      {SECCIONES.map((titulo) => (
        <div key={titulo}>
          <SectionTitle title={titulo} sizeTitle="3xl" />

          <Alert icon={<Construction />} color="warning">
            En construcción
          </Alert>
        </div>
      ))}
    </div>
  );
}
