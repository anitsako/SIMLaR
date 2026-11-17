import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Input, addToast } from '@heroui/react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { updateUsuarioContraseñaFn } from '@/usuarios/update-usuario-contraseña.fn';
import { logoutFn } from '@/auth/logout.fn';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authed/usuarios/modificar-contraseña/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState({ passwordOld: '', passwordNew: '', passwordConfirm: '' });

  const [validationError, setValidationError] = useState<string | null>(null);

  const logout = useServerFn(logoutFn);
  const { mutate: salir } = useMutation({ mutationFn: logout });

  const updateUsuarioContraseña = useServerFn(updateUsuarioContraseñaFn);
  const {
    mutate: modificarUsuarioContraseña,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateUsuarioContraseña,
    onSuccess: () => {
      addToast({
        title: t('routes.admin.usuarios.contrasena.modificadaTitulo'),
        description: t('routes.admin.usuarios.contrasena.modificadaDescripcion'),
        color: 'success',
        variant: 'flat',
      });
      salir({});
    },
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    setValidationError(null);

    if (data.passwordNew !== data.passwordConfirm) {
      setValidationError(t('routes.admin.usuarios.contrasena.noCoinciden'));
    }

    modificarUsuarioContraseña({ data: { passwordOld: data.passwordOld, passwordNew: data.passwordNew } });
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
          label={t('routes.admin.usuarios.contrasena.actual')}
          type="password"
          minLength={8}
          value={data.passwordOld}
          onValueChange={(v) => setData((prev) => ({ ...prev, passwordOld: v }))}
        />
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
          {t('routes.admin.usuarios.contrasena.modificarBoton')}
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/' })} className="bg-primary-50 ml-2">
          {t('common.acciones.volver')}
        </Button>
      </form>
    </div>
  );
}
