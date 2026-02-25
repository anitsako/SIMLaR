import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { getRouteApi } from '@tanstack/react-router';
import { PanelLateral } from './panel-lateral';
import { UserMenu } from '@/auth/user-menu';
import { UserLogin } from '@/auth/user-login';

const rootRoute = getRouteApi('__root__');

export const AppBar = () => {
  const { usuario } = rootRoute.useRouteContext();

  return (
    <Navbar classNames={{ wrapper: 'px-4' }} maxWidth="full">
      <NavbarContent>
        <PanelLateral />
        <NavbarBrand>
          <div className="flex flex-col">
            <p className="text-3xl font-bold">SIMLaR</p>
            <p className="text-md text-default-500">Sistema de Información Minera La Rioja</p>
          </div>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>{usuario ? <UserMenu /> : <UserLogin />}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
