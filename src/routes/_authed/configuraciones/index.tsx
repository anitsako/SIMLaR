import { Button, Tab, Tabs } from '@heroui/react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { UsuariosTable } from '@/usuarios/usuarios.table';

export const Route = createFileRoute('/_authed/configuraciones/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col mt-4">
      <p className="text-5xl font-bold text-center">Configuraciones</p>
      <div className="flex flex-nowrap items-center mt-4 gap-4">
        <Tabs>
          <Tab key="usuarios" title="Usuarios"></Tab>
        </Tabs>
        <Button as={Link} to="/usuarios/crear" variant="flat" color="primary">
          Crear Usuario
        </Button>
        <Button as={Link} to="/carrousel/cargar" variant="flat" color="primary">
          Cargar Imágenes Carrousel
        </Button>
      </div>
      <div className="mt-4">
        <UsuariosTable />
      </div>
    </div>
  );
}
