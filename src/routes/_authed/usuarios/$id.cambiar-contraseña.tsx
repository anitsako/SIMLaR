import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Input, addToast } from '@heroui/react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { changeUsuarioContraseñaFn } from '@/usuarios/change-usuario-contraseña.fn';

export const Route = createFileRoute('/_authed/usuarios/$id/cambiar-contraseña')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ passwordNew: '', passwordConfirm: '' });

  const [validationError, setValidationError] = useState<string | null>(null);

  const changeUsuarioContraseña = useServerFn(changeUsuarioContraseñaFn);
  const {
    mutate: cambiarUsuarioContraseña,
    isPending,
    error,
  } = useMutation({
    mutationFn: changeUsuarioContraseña,
    onSuccess: () => {
      addToast({
        title: 'Contraseña cambiada con éxito',
        description: 'La contraseña fue cambiada correctamente',
        color: 'success',
        variant: 'flat',
      });
      navigate({ to: '/usuarios' });
    },
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    setValidationError(null);

    if (data.passwordNew !== data.passwordConfirm) {
      setValidationError('La nueva contraseña y la confirmación no coinciden.');
    }

    cambiarUsuarioContraseña({ data: { id: Number(id), passwordNew: data.passwordNew } });
  };

  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-2xl font-bold">Modificar contraseña</h1>
      {(validationError || error) && (
        <Alert color="danger">{validationError ?? (error as any)?.message ?? 'Error al modificar contraseña.'}</Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          isRequired
          label="Contraseña nueva"
          type="password"
          minLength={8}
          value={data.passwordNew}
          onValueChange={(v) => setData((prev) => ({ ...prev, passwordNew: v }))}
        />
        <Input
          isRequired
          label="Confirmar contraseña"
          type="password"
          minLength={8}
          value={data.passwordConfirm}
          onValueChange={(v) => setData((prev) => ({ ...prev, passwordConfirm: v }))}
        />

        <Button type="submit" isLoading={isPending} color="primary">
          Cambiar contraseña
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/' })} className="bg-primary-50 ml-2">
          Volver
        </Button>
      </form>
    </div>
  );
}
