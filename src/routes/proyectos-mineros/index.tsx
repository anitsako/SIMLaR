import { Link, createFileRoute } from '@tanstack/react-router';
import { Button } from '@heroui/react';
import { z } from 'zod';
import { ProyectosMinerosTable } from '@/proyectos-mineros/proyectos-mineros.table';
import { ProyectosMinerosFilters } from '@/proyectos-mineros/proyectos-mineros.filters';
import { ProyectosMinerosActiveFilters } from '@/proyectos-mineros/proyectos-mineros.active-filters';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/proyectos-mineros/')({
  validateSearch: z.object({
    nombreLike: z.string().optional(),
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(8),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-center mb-4 relative">
        <SectionTitle title="Proyectos Mineros" />
        <div className="absolute right-0 flex items-center gap-2">
          <ProyectosMinerosFilters />
          <Button as={Link} to="/proyectos-mineros/crear" color="primary" size="sm">
            Crear proyecto
          </Button>
        </div>
      </div>
      <ProyectosMinerosActiveFilters />
      <ProyectosMinerosTable />
    </div>
  );
}
