import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { Link, getRouteApi } from '@tanstack/react-router';
import { PanelLateral } from './panel-lateral';
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
            <a
              href="https://larioja.gob.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label="Ir al sitio oficial del Gobierno de La Rioja"
            >
              <>
                <Image
                  src="/branding/la-rioja-gobierno.png"
                  alt="La Rioja Gobierno"
                  className="hidden h-9 min-w-[142px] max-w-[142px] shrink-0 object-contain md:block"
                  radius="none"
                />
                <Image
                  src="/branding/la-rioja-gobierno-small.png"
                  alt="La Rioja Gobierno"
                  className="block h-9 min-w-[39px] max-w-[39px] shrink-0 object-contain md:hidden"
                  radius="none"
                />
              </>
            </a>

            <div className="h-10 w-1.5 rounded-sm bg-success" />

            <Link
              to="/"
              className="flex flex-col leading-tight transition-opacity hover:opacity-80"
              aria-label="Volver al inicio de SIMLaR"
            >
              <p className="text-2xl font-bold text-default-800">SIMLaR</p>
              <p className="text-sm text-default-500">
                Sistema de Información Minera La Rioja
              </p>
            </Link>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>{usuario ? <UserMenu /> : <UserLogin />}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};