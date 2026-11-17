import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Input, addToast } from '@heroui/react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { changeUsuarioContraseñaFn } from '@/usuarios/change-usuario-contraseña.fn';

export const Route = createFileRoute('/_authed/usuarios/$id/cambiar-contraseña')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
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
        title: t('routes.admin.usuarios.contrasena.cambiadaTitulo'),
        description: t('routes.admin.usuarios.contrasena.cambiadaDescripcion'),
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
      setValidationError(t('routes.admin.usuarios.contrasena.noCoinciden'));
    }

    cambiarUsuarioContraseña({ data: { id: Number(id), passwordNew: data.passwordNew } });
  };

  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-2xl font-bold">{t('routes.admin.usuarios.contrasena.titulo')}</h1>
      {(validationError || error) && (
        <Alert color="danger">{validationError ?? (error as any)?.message ?? t('routes.admin.usuarios.contrasena.error')}</Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          isRequired
          label={t('routes.admin.usuarios.contrasena.nueva')}
          type="password"
          minLength={8}
          value={data.passwordNew}
          onValueChange={(v) => setData((prev) => ({ ...prev, passwordNew: v }))}
        />
        <Input
          isRequired
          label={t('routes.admin.usuarios.contrasena.confirmar')}
          type="password"
          minLength={8}
          value={data.passwordConfirm}
          onValueChange={(v) => setData((prev) => ({ ...prev, passwordConfirm: v }))}
        />

        <Button type="submit" isLoading={isPending} color="primary">
          {t('routes.admin.usuarios.contrasena.cambiarBoton')}
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/' })} className="bg-primary-50 ml-2">
          {t('common.acciones.volver')}
        </Button>
      </form>
    </div>
  );
}
