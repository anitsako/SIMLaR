import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Alert, Button, Checkbox, Input, addToast } from '@heroui/react';
import type { SubmitEvent } from 'react';
import { updateUsuarioFn } from '@/usuarios/update-usuario.fn';
import { usuarioQuery } from '@/usuarios/use-usuario';

export const Route = createFileRoute('/_authed/usuarios/$id/modificar')({
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
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(usuarioQuery(Number(id)));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: usuario } = useSuspenseQuery(usuarioQuery(Number(id)));
  const { queryClient } = Route.useRouteContext();

  const navigate = Route.useNavigate();

  const [data, setData] = useState({
    username: usuario.username,
    apellido: usuario.apellido,
    nombre: usuario.nombre,
    email: usuario.email || '',
    esAdmin: usuario.esAdmin,
    activo: usuario.activo,
  });

  const updateUsuario = useServerFn(updateUsuarioFn);

  const {
    mutate: modificarUsuario,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      addToast({
        title: 'Usuario modificado',
        description: 'El usuario fue modificado exitosamente',
        color: 'success',
        variant: 'flat',
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      navigate({ to: '/usuarios' });
    },
    onError: () => {
      addToast({
        title: 'Error',
        description: `Ocurrió un error al modificar el usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        color: 'danger',
        variant: 'flat',
      });
    },
  });
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    modificarUsuario({
      data: {
        id: Number(id),
        ...data,
      },
    });
  };

  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-2xl font-bold">Modificar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          value={data.username}
          onValueChange={(v) => setData((prev) => ({ ...prev, username: v }))}
          maxLength={50}
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
        <div>
          <Checkbox isSelected={data.activo} onValueChange={(v) => setData((prev) => ({ ...prev, activo: v }))}>
            Activo
          </Checkbox>
        </div>

        <Button type="submit" isLoading={isPending} color="primary">
          Modificar Usuario
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/usuarios' })} className="bg-primary-50 ml-2">
          Volver
        </Button>
      </form>
    </div>
  );
}
