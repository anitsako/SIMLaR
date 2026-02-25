import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { getRouteApi } from '@tanstack/react-router';
import { PanelLateral } from './panel-lateral';
import logoGob from '@/assets/branding/la-rioja-gobierno.png';
import { UserMenu } from '@/auth/user-menu';
import { UserLogin } from '@/auth/user-login';

const rootRoute = getRouteApi('__root__');

export const AppBar = () => {
  const { usuario } = rootRoute.useRouteContext();

  return (
    <Navbar
      maxWidth="full"
      classNames={{
        base: 'w-full bg-white border-b border-danger-100',
        wrapper: 'w-full max-w-none px-6',
      }}
    >
      <NavbarContent>
        <PanelLateral />

        <NavbarBrand>
          <div className="flex items-center gap-4">
            <img src={logoGob} alt="La Rioja Gobierno" className="h-9" />

            <div className="h-10 w-1.5 rounded-sm bg-success" />

            <div className="flex flex-col leading-tight">
              <p className="text-2xl font-bold text-default-800">SIMLaR</p>
              <p className="text-sm text-default-500">Sistema de Información Minera La Rioja</p>
            </div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>{usuario ? <UserMenu /> : <UserLogin />}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

