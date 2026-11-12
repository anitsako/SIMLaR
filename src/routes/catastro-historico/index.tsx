import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/catastro-historico/')({
  beforeLoad: () => {
    throw redirect({ to: '/catastro', hash: 'catastro-historico', replace: true });
  },
});
