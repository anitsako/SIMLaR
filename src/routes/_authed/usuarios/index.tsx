import { Alert, Button } from '@heroui/react';
import { Link, createFileRoute } from '@tanstack/react-router';
import { UsuariosTable } from '@/usuarios/usuarios.table';
import { useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/_authed/usuarios/')({
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
  return (
    <div className="flex flex-col gap-4 mt-4">
      <SectionTitle
        title={t('routes.admin.usuarios.page.title')}
        rightSlot={
          <Button as={Link} to="/usuarios/crear" color="primary">
            {t('routes.admin.usuarios.page.crear')}
          </Button>
        }
      />
      <div>
        <UsuariosTable />
      </div>
    </div>
  );
}
