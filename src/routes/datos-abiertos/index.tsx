import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/datos-abiertos/')({
  component: RouteComponent,
});

const sections = [
  'Información minera general',
  'Sección de aprendizaje',
  'Datasets mineros',
  'Estadísticas del sector',
  'Informes técnicos consolidados',
  'Producción minera',
];

function RouteComponent() {
  return (
    <div className="mt-4 space-y-6">
      <SectionTitle title="Datos abiertos" sizeTitle="5xl" textCenter />

      {sections.map((title) => (
        <div key={title}>
          <SectionTitle title={title} sizeTitle="3xl" />

          <Alert icon={<Construction />} color="warning">
            En construcción
          </Alert>
        </div>
      ))}
    </div>
  );
}
