import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { Link, getRouteApi } from '@tanstack/react-router';
import { PanelLateral } from './panel-lateral';
import { UserMenu } from '@/auth/user-menu';
import { UserLogin } from '@/auth/user-login';
import { SelectorIdioma } from './selector-idioma';
import { useTranslation } from 'react-i18next';

const rootRoute = getRouteApi('__root__');

export const AppBar = () => {
  const { usuario } = rootRoute.useRouteContext();
  const { t } = useTranslation();

  return (
    <Navbar
      maxWidth="full"
      classNames={{
        base: 'w-full bg-white border-b border-danger-100',
        wrapper: 'w-full max-w-none px-6',
      }}
    >
      <NavbarContent>
        <NavbarBrand>
          <div className="flex items-center gap-4">
            <a
              href="https://larioja.gob.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={t('common.gobierno.linkAria')}
            >
              <>
                <Image
                  src="/branding/la-rioja-gobierno.png"
                  alt={t('common.gobierno.logoAlt')}
                  className="hidden h-9 min-w-35.5 max-w-35.5 shrink-0 object-contain md:block"
                  radius="none"
                />
                <Image
                  src="/branding/la-rioja-gobierno-small.png"
                  alt={t('common.gobierno.logoAlt')}
                  className="block h-9 min-w-9.75 max-w-9.75 shrink-0 object-contain md:hidden"
                  radius="none"
                />
              </>
            </a>

            <div className="h-10 w-1.5 rounded-sm bg-success" />

            <Link
              to="/"
              className="flex flex-col leading-tight transition-opacity hover:opacity-80"
              aria-label={t('nav.volverInicioAria')}
            >
              <p className="text-2xl font-bold text-default-800">SIMLaR</p>
              <p className="text-sm text-default-500">
                {t("nav.brandName")}
              </p>
            </Link>
          </div>
        </NavbarBrand>

        <PanelLateral />
      </NavbarContent>

      <NavbarContent>
        <NavbarItem><SelectorIdioma /></NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>{usuario ? <UserMenu /> : <UserLogin />}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
