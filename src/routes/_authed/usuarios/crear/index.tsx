import { createFileRoute } from '@tanstack/react-router';
import { Button, Input, Select, SelectItem, addToast } from '@heroui/react';

export const Route = createFileRoute('/_authed/usuarios/crear/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Crear Usuario</h1>
      <form className="space-y-4">
        <Input label="Username" maxLength={50} isRequired />
        <Input label="Contraseña" type="password" minLength={8} isRequired />
        <Input label="Nombre" maxLength={50} isRequired />
        <Input label="Apellido" maxLength={50} isRequired />
        <Input label="Email" type="email" maxLength={250} isRequired />
        <Select label="Activo">
          <SelectItem>Si</SelectItem>
          <SelectItem>No</SelectItem>
        </Select>
        <Button type="submit" color="primary">
          Crear Usuario
        </Button>
      </form>
    </div>
  );
}
