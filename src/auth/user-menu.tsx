import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getRouteApi } from '@tanstack/react-router';
import { CircleUserRound, Key, LogOut } from 'lucide-react';
import { logoutFn } from './logout.fn';
import { useTranslation } from 'react-i18next';

const rootRoute = getRouteApi('__root__');

export const UserMenu = () => {
  const { usuario } = rootRoute.useRouteContext();
  const { t } = useTranslation();

  const logout = useServerFn(logoutFn);
  const { mutate: salir, isPending } = useMutation({ mutationFn: logout });

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="primary" startContent={<CircleUserRound />} isLoading={isPending}>
          {usuario?.apellido}, {usuario?.nombre}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="update-password" href="/usuarios/modificar-contraseña" startContent={<Key />}>
          {t('auth.menu.modificarContrasena')}
        </DropdownItem>
        <DropdownItem key="logout" startContent={<LogOut />} onPress={() => salir({})}>
          {t('auth.menu.salir')}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
