import { Tab, Tabs } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { UsuariosTable } from '@/usuarios/usuarios.table';

export const Route = createFileRoute('/_authed/configuraciones/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col mt-4">
      <p className="text-5xl font-bold text-center">Configuraciones</p>
      <Tabs className="mt-4">
        <Tab key="usuarios" title="Usuarios">
          <UsuariosTable />
        </Tab>
      </Tabs>
    </div>
  );
}
