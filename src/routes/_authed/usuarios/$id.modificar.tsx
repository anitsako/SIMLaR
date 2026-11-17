import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Alert, Button, Checkbox, Input, addToast } from '@heroui/react';
import type { SubmitEvent } from 'react';
import { updateUsuarioFn } from '@/usuarios/update-usuario.fn';
import { useTranslation } from 'react-i18next';
import { usuarioQuery } from '@/usuarios/use-usuario';

export const Route = createFileRoute('/_authed/usuarios/$id/modificar')({
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
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(usuarioQuery(Number(id)));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
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
        title: t('routes.admin.usuarios.modificar.exitoTitulo'),
        description: t('routes.admin.usuarios.modificar.exitoDescripcion'),
        color: 'success',
        variant: 'flat',
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      navigate({ to: '/usuarios' });
    },
    onError: () => {
      addToast({
        title: t('routes.admin.usuarios.modificar.errorTitulo'),
        description: t('routes.admin.usuarios.modificar.errorDescripcion', {
          mensaje: error instanceof Error ? error.message : t('common.errores.errorDesconocido'),
        }),
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
      <h1 className="text-2xl font-bold">{t('routes.admin.usuarios.modificar.titulo')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('routes.admin.usuarios.form.username')}
          value={data.username}
          onValueChange={(v) => setData((prev) => ({ ...prev, username: v }))}
          maxLength={50}
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
        <div>
          <Checkbox isSelected={data.activo} onValueChange={(v) => setData((prev) => ({ ...prev, activo: v }))}>
            {t('routes.admin.usuarios.form.activo')}
          </Checkbox>
        </div>

        <Button type="submit" isLoading={isPending} color="primary">
          {t('routes.admin.usuarios.modificar.boton')}
        </Button>
        <Button type="button" onPress={() => navigate({ to: '/usuarios' })} className="bg-primary-50 ml-2">
          {t('common.acciones.volver')}
        </Button>
      </form>
    </div>
  );
}
