import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Checkbox, Input, addToast } from '@heroui/react';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { createUsuarioFn } from '@/usuarios/create-usuario.fn';

export const Route = createFileRoute('/_authed/usuarios/crear/')({
  beforeLoad: ({ context }) => {
    if (!context.usuario?.esAdmin) {
      throw new Error('Not authorized');
    }
  },
  errorComponent: ({ error }) => {
    const { t } = useTranslation();

    if (error.message === 'Not authorized') {
      return (
        <div className="max-w-6xl w-full">
          <Alert color="danger" title={t('common.errores.noAutorizado')} />
        </div>
      );
    }

    throw error;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
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
        title: t('routes.admin.usuarios.crear.exitoTitulo'),
        description: t('routes.admin.usuarios.crear.exitoDescripcion'),
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
      <h1 className="text-2xl font-bold">{t('routes.admin.usuarios.crear.titulo')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('routes.admin.usuarios.form.username')}
          value={data.username}
          onValueChange={(v) => setData((prev) => ({ ...prev, username: v }))}
          maxLength={50}
          isRequired
        />
        <Input
          label={t('routes.admin.usuarios.form.contrasena')}
          value={data.contraseña}
          onValueChange={(v) => setData((prev) => ({ ...prev, contraseña: v }))}
          type="password"
          minLength={8}
          isRequired
        />
        <Input
          label={t('routes.admin.usuarios.form.nombre')}
          value={data.nombre}
          onValueChange={(v) => setData((prev) => ({ ...prev, nombre: v }))}
          maxLength={50}
          isRequired
        />
        <Input
          label={t('routes.admin.usuarios.form.apellido')}
          value={data.apellido}
          onValueChange={(v) => setData((prev) => ({ ...prev, apellido: v }))}
          maxLength={50}
          isRequired
        />
        <Input
          label={t('routes.admin.usuarios.form.email')}
          value={data.email}
          onValueChange={(v) => setData((prev) => ({ ...prev, email: v }))}
          type="email"
          maxLength={250}
          isRequired
        />
        <div>
          <Checkbox isSelected={data.esAdmin} onValueChange={(v) => setData((prev) => ({ ...prev, esAdmin: v }))}>
            {t('routes.admin.usuarios.form.esAdmin')}
          </Checkbox>
        </div>

        {(validationError || error) && (
          <Alert color="danger">{validationError ?? (error as any)?.message ?? t('routes.admin.usuarios.crear.error')}</Alert>
        )}

        <Button type="submit" isLoading={isPending} color="primary">
          {t('routes.admin.usuarios.crear.boton')}
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/usuarios' })} className="bg-primary-50 ml-2">
          {t('common.acciones.volver')}
        </Button>
      </form>
    </div>
  );
}
