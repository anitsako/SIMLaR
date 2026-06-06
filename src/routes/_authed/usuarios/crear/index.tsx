import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Checkbox, Input, addToast } from '@heroui/react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { createUsuarioFn } from '@/usuarios/create-usuario.fn';

export const Route = createFileRoute('/_authed/usuarios/crear/')({
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
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    contraseña: '',
    nombre: '',
    apellido: '',
    email: '',
    esAdmin: false,
    activo: true,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const createUsuario = useServerFn(createUsuarioFn);

  const {
    mutate: crearUsuario,
    isPending,
    error,
  } = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      addToast({
        title: 'Usuario creado',
        description: 'El usuario fue creado correctamente',
        color: 'success',
        variant: 'flat',
      });
      navigate({ to: '/usuarios' });
    },
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    setValidationError(null);

    crearUsuario({
      data: {
        ...data,
        password: data.contraseña,
      },
    });
  };

  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-2xl font-bold">Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          value={data.username}
          onValueChange={(v) => setData((prev) => ({ ...prev, username: v }))}
          maxLength={50}
          isRequired
        />
        <Input
          label="Contraseña"
          value={data.contraseña}
          onValueChange={(v) => setData((prev) => ({ ...prev, contraseña: v }))}
          type="password"
          minLength={8}
          isRequired
        />
        <Input
          label="Nombre"
          value={data.nombre}
          onValueChange={(v) => setData((prev) => ({ ...prev, nombre: v }))}
          maxLength={50}
          isRequired
        />
        <Input
          label="Apellido"
          value={data.apellido}
          onValueChange={(v) => setData((prev) => ({ ...prev, apellido: v }))}
          maxLength={50}
          isRequired
        />
        <Input
          label="Email"
          value={data.email}
          onValueChange={(v) => setData((prev) => ({ ...prev, email: v }))}
          type="email"
          maxLength={250}
          isRequired
        />
        <div>
          <Checkbox isSelected={data.esAdmin} onValueChange={(v) => setData((prev) => ({ ...prev, esAdmin: v }))}>
            Es administrador
          </Checkbox>
        </div>

        {(validationError || error) && (
          <Alert color="danger">{validationError ?? (error as any)?.message ?? 'Error al crear el usuario.'}</Alert>
        )}

        <Button type="submit" isLoading={isPending} color="primary">
          Crear Usuario
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/usuarios' })} className="bg-primary-50 ml-2">
          Volver
        </Button>
      </form>
    </div>
  );
}
