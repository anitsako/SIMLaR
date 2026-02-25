import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getRouteApi } from '@tanstack/react-router';
import { CircleUserRound, LogOut } from 'lucide-react';
import { logoutFn } from './logout.fn';

const rootRoute = getRouteApi('__root__');

export const UserMenu = () => {
  const { usuario } = rootRoute.useRouteContext();

  const logout = useServerFn(logoutFn);
  const { mutate, isPending } = useMutation({ mutationFn: logout });

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="primary" startContent={<CircleUserRound />} isLoading={isPending}>
          {usuario?.apellido}, {usuario?.nombre}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="logout" startContent={<LogOut />} onPress={() => mutate({})}>
          Salir
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
