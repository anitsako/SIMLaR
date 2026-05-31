import { Button } from '@heroui/react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { UsuariosTable } from '@/usuarios/usuarios.table';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/_authed/usuarios/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <SectionTitle title="Configuración de usuarios" textCenter />
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
