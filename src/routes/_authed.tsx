import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.usuario) {
      throw new Error('Not authenticated');
    }
  },
  errorComponent: ({ error }) => {
    const { t } = useTranslation();

    if (error.message === 'Not authenticated') {
      return (
        <div className="max-w-6xl w-full">
          <Alert color="danger" title={t('auth.noAutenticado')} />
        </div>
      );
    }

    throw error;
  },
});
