import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  useDisclosure,
} from '@heroui/react';
import { Link, getRouteApi, useRouterState } from '@tanstack/react-router';
import {
  Blend,
  Briefcase,
  Building,
  ChartBar,
  ChevronDown,
  ContactRound,
  House,
  Images,
  LibraryBig,
  Map,
  MenuIcon,
  Pickaxe,
  Target,
  Users,
  ClipboardList
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const rootRoute = getRouteApi('__root__');

type RutaInterna =
  | '/'
  | '/institucional'
  | '/objetivos'
  | '/transparencia'
  | '/contacto'
  | '/proyectos-mineros'
  | '/mapas-geologicos'
  | '/catastro'
  | '/servicios'
  | '/educacion'
  | '/carrousel-imagenes'
  | '/departamentos-imagenes'
  | '/indicadores-sociales'
  | '/usuarios'
  | '/analytics'
  | '/google-analytics'
  | '/galeria-fotos'
  | '/galeria-fotos/administrar'
  | '/programas';

type MenuItem = {
  label: string;
  href: RutaInterna;
  icon: ReactNode;
};

type MenuGroup = {
  label: string;
  items: Array<MenuItem>;
};

const institucionalItems: Array<MenuItem> = [
  {
    label: 'nav.institucional.items.autoridades',
    href: '/institucional',
    icon: <Building size={18} />,
  },
  {
    label: 'nav.institucional.items.objetivos',
    href: '/objetivos',
    icon: <Target size={18} />,
  },
  {
    label: 'nav.institucional.items.contacto',
    href: '/contacto',
    icon: <ContactRound size={18} />,
  },
];

const informacionMineraItems: Array<MenuItem> = [
  {
    label: 'nav.informacionMinera.items.proyectosMineros',
    href: '/proyectos-mineros',
    icon: <Pickaxe size={18} />,
  },
  {
    label: 'nav.informacionMinera.items.mapasGeologicos',
    href: '/mapas-geologicos',
    icon: <Map size={18} />,
  },
  {
    label: 'nav.informacionMinera.items.marcoNormativo',
    href: '/transparencia',
    icon: <Blend size={18} />,
  },
  {
    label: 'nav.informacionMinera.items.catastro',
    href: '/catastro',
    icon: <Map size={18} />,
  },
  {
    label: 'nav.informacionMinera.items.galeriaFotos',
    href: '/galeria-fotos',
    icon: <Images size={18} />,
  },
];

const serviciosFormacionItems: Array<MenuItem> = [
  {
    label: 'nav.serviciosFormacion.items.servicios',
    href: '/servicios',
    icon: <Briefcase size={18} />,
  },
  {
    label: 'nav.serviciosFormacion.items.educacionMinera',
    href: '/educacion',
    icon: <LibraryBig size={18} />,
  },
  {
    label: 'nav.serviciosFormacion.items.programas',
    href: '/programas',
    icon: <ClipboardList size={18} />,
  }
];

const administracionItems: Array<MenuItem> = [
  {
    label: 'nav.administracion.items.carrouselImagenes',
    href: '/carrousel-imagenes',
    icon: <Images size={18} />,
  },
  {
    label: 'nav.administracion.items.galeriaFotos',
    href: '/galeria-fotos/administrar',
    icon: <Images size={18} />,
  },
  {
    label: 'nav.administracion.items.googleAnalytics',
    href: '/google-analytics',
    icon: <ChartBar size={18} />,
  },
  {
    label: 'nav.administracion.items.imagenesDepartamentos',
    href: '/departamentos-imagenes',
    icon: <Images size={18} />,
  },
  {
    label: 'nav.administracion.items.indicadoresSociales',
    href: '/indicadores-sociales',
    icon: <ChartBar size={18} />,
  },
  {
    label: 'nav.administracion.items.usuarios',
    href: '/usuarios',
    icon: <Users size={18} />,
  },
];

const publicMenuGroups: Array<MenuGroup> = [
  {
    label: 'nav.institucional.label',
    items: institucionalItems,
  },
  {
    label: 'nav.informacionMinera.label',
    items: informacionMineraItems,
  },
  {
    label: 'nav.serviciosFormacion.label',
    items: serviciosFormacionItems,
  },
];

const adminMenuGroup: MenuGroup = {
  label: 'nav.administracion.label',
  items: administracionItems,
};

export const PanelLateral = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { usuario } = rootRoute.useRouteContext();
  const { t } = useTranslation();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const menuGroups = usuario ? [...publicMenuGroups, adminMenuGroup] : publicMenuGroups;

  const isGroupActive = (items: Array<MenuItem>) =>
    items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <>
      <nav className="hidden xl:flex items-center gap-2">
        <Link
          to="/"
          className="px-3 py-2 text-sm font-bold uppercase text-default-700 transition-colors hover:text-danger"
          activeProps={{
            className: 'px-3 py-2 text-sm font-bold uppercase text-danger border-b-2 border-danger',
          }}
        >
          {t('nav.inicio')}
        </Link>

        {menuGroups.map((group) => {
          const active = isGroupActive(group.items);

          return (
            <Dropdown key={group.label} placement="bottom-start">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className={
                    active
                      ? 'px-3 py-2 text-sm font-bold uppercase text-danger border-b-2 border-danger rounded-none'
                      : 'px-3 py-2 text-sm font-bold uppercase text-default-700 hover:text-danger rounded-none'
                  }
                  endContent={<ChevronDown size={16} />}
                >
                  {t(group.label)}
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label={group.label}>
                {group.items.map((item) => {
                  const itemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <DropdownItem
                      key={item.href}
                      href={item.href}
                      startContent={item.icon}
                      className={itemActive ? 'text-danger font-semibold' : ''}
                    >
                      {t(item.label)}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          );
        })}
      </nav>

      <div className="xl:hidden">
        <Button className="bg-white" isIconOnly onPress={onOpen} variant="flat">
          <MenuIcon />
        </Button>

        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerContent className="max-w-xs">
            <DrawerHeader>
              <p className="text-xl font-bold">{t('nav.menuMovil')}</p>
            </DrawerHeader>

            <DrawerBody className="flex flex-col gap-4">
              <Listbox aria-label={t('nav.inicio')}>
                <ListboxItem
                  key="/"
                  href="/"
                  color="danger"
                  startContent={<House size={18} />}
                  className={pathname === '/' ? 'text-danger font-semibold' : ''}
                >
                  {t('nav.inicio')}
                </ListboxItem>
              </Listbox>

              {menuGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <p
                    className={
                      isGroupActive(group.items)
                        ? 'px-2 text-xs font-bold uppercase text-danger'
                        : 'px-2 text-xs font-bold uppercase text-default-400'
                    }
                  >
                    {t(group.label)}
                  </p>

                  <Listbox aria-label={t(group.label)}>
                    {group.items.map((item) => {
                      const itemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                      return (
                        <ListboxItem
                          key={item.href}
                          href={item.href}
                          color="danger"
                          startContent={item.icon}
                          className={itemActive ? 'text-danger font-semibold' : ''}
                        >
                          {t(item.label)}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>
                </div>
              ))}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
