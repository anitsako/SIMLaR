import { Alert } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.usuario) {
      throw new Error('Not authenticated');
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return (
        <div className="max-w-6xl w-full">
          <Alert color="danger" title="No estás autenticado. Por favor, inicia sesión para acceder a esta página." />
        </div>
      );
    }

    throw error;
  },
});
