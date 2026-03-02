import { Link, createFileRoute } from '@tanstack/react-router';
import { Button } from '@heroui/react';
import { z } from 'zod';
import { ProyectosMinerosTable } from '@/proyectos-mineros/proyectos-mineros.table';
import { ProyectosMinerosFilters } from '@/proyectos-mineros/proyectos-mineros.filters';
import { ProyectosMinerosActiveFilters } from '@/proyectos-mineros/proyectos-mineros.active-filters';

export const Route = createFileRoute('/proyectos-mineros/')({
  validateSearch: z.object({
    nombreLike: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  }),
  preSearchFilters: [
    (search) => ({
      ...search,
      page: search.page ?? 1,
      limit: search.limit ?? 8,
    }),
  ],
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-center mb-4 relative">
        <p className="text-3xl font-bold text-center">Proyectos Mineros</p>
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
