import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getRouteApi } from '@tanstack/react-router';
import { CircleUserRound, Key, LogOut } from 'lucide-react';
import { logoutFn } from './logout.fn';

const rootRoute = getRouteApi('__root__');

export const UserMenu = () => {
  const { usuario } = rootRoute.useRouteContext();

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
          Modificar contraseña
        </DropdownItem>
        <DropdownItem key="logout" startContent={<LogOut />} onPress={() => salir({})}>
          Salir
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
