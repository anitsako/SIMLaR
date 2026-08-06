import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Button } from '@heroui/react';
import { z } from 'zod';

import { ProyectosMinerosTable } from '@/proyectos-mineros/proyectos-mineros.table';
import { ProyectosMinerosFilters } from '@/proyectos-mineros/proyectos-mineros.filters';
import { ProyectosMinerosStats } from '@/proyectos-mineros/proyectos-mineros.stats';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/proyectos-mineros/')({
  validateSearch: z.object({
    nombreLike: z.string().optional(),
    tiposIds: z.array(z.number().int().positive()).optional(),
    etapasIds: z.array(z.number().int().positive()).optional(),
    minerales: z.array(z.string()).optional(),
    ubicaciones: z.array(z.string()).optional(),
    propietarios: z.array(z.string()).optional(),
    provinciasGeologicas: z.array(z.string()).optional(),
    convenioEmse: z.boolean().optional(),
    estadoVisible: z.boolean().optional(),
    msnmDesde: z.number().int().optional(),
    msnmHasta: z.number().int().optional(),
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(8),
  }),
  component: RouteComponent,
});

const rootRoute = getRouteApi('__root__');

function RouteComponent() {
  const { usuario } = rootRoute.useRouteContext();

  // Visitantes: solamente proyectos visibles.
  // Usuarios autenticados: todos, con opción de filtrar por visibilidad.
  const visibleBase = usuario === null ? true : undefined;
  const mostrarFiltroVisibilidad = usuario !== null;

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle
          title="Proyectos Mineros"
          rightSlot={
            <Button as={Link} to="/proyectos-mineros/crear" color="primary" size="sm">
              Crear proyecto
            </Button>
          }
        />
      </div>

      <div className="mb-4 rounded-xl border border-default-200 bg-white p-3 shadow-sm">
        <ProyectosMinerosFilters visibleBase={visibleBase} mostrarFiltroVisibilidad={mostrarFiltroVisibilidad} />
      </div>

      <ProyectosMinerosTable visibleBase={visibleBase} />

      <ProyectosMinerosStats visibleBase={visibleBase} />
    </div>
  );
}
