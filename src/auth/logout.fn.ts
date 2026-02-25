import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';
import { useAppSession } from './use-app-session';

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  // Obtengo y cierro sesion
  const session = await useAppSession();
  await session.clear();
  throw redirect({ to: '/' });
});
