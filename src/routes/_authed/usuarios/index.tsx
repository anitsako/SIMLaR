import { Alert, Button } from '@heroui/react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { UsuariosTable } from '@/usuarios/usuarios.table';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/_authed/usuarios/')({
  beforeLoad: ({ context }) => {
    if (!context.usuario?.esAdmin) {
      throw new Error('Not authorized');
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authorized') {
      return (
        <div className="max-w-6xl w-full">
          <Alert color="danger" title="No estás autorizado. No tienes permisos para acceder a esta página." />
        </div>
      );
    }

    throw error;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <SectionTitle title="Configuración de usuarios" />
      <div className="flex flex-row justify-end">
        <Button as={Link} to="/usuarios/crear" color="primary">
          Crear Usuario
        </Button>
      </div>
      <div>
        <UsuariosTable />
      </div>
    </div>
  );
}
