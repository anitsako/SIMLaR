import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/catastro-minero/')({
  beforeLoad: () => {
    throw redirect({ to: '/catastro', hash: 'catastro-minero', replace: true });
  },
});
