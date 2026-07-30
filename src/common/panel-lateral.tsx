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
} from 'lucide-react';
import type { ReactNode } from 'react';

const rootRoute = getRouteApi('__root__');

type RutaInterna =
  | '/'
  | '/institucional'
  | '/objetivos'
  | '/transparencia'
  | '/contacto'
  | '/proyectos-mineros'
  | '/mapas-geologicos'
  | '/servicios'
  | '/educacion'
  | '/carrousel-imagenes'
  | '/departamentos-imagenes'
  | '/indicadores-sociales'
  | '/usuarios'
  | '/analytics'
  | '/google-analytics';

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
    label: 'Autoridades',
    href: '/institucional',
    icon: <Building size={18} />,
  },
  {
    label: 'Objetivos',
    href: '/objetivos',
    icon: <Target size={18} />,
  },
  {
    label: 'Contacto',
    href: '/contacto',
    icon: <ContactRound size={18} />,
  },
];

const informacionMineraItems: Array<MenuItem> = [
  {
    label: 'Proyectos mineros',
    href: '/proyectos-mineros',
    icon: <Pickaxe size={18} />,
  },
  {
    label: 'Mapas geológicos',
    href: '/mapas-geologicos',
    icon: <Map size={18} />,
  },
  {
    label: 'Marco normativo',
    href: '/transparencia',
    icon: <Blend size={18} />,
  },
];

const serviciosFormacionItems: Array<MenuItem> = [
  {
    label: 'Servicios',
    href: '/servicios',
    icon: <Briefcase size={18} />,
  },
  {
    label: 'Educación minera',
    href: '/educacion',
    icon: <LibraryBig size={18} />,
  },
];

const administracionItems: Array<MenuItem> = [
  {
    label: 'Carrousel de imágenes',
    href: '/carrousel-imagenes',
    icon: <Images size={18} />,
  },
  {
    label: 'Google Analytics',
    href: '/google-analytics',
    icon: <ChartBar size={18} />,
  },
  {
    label: 'Imágenes de departamentos',
    href: '/departamentos-imagenes',
    icon: <Images size={18} />,
  },
  {
    label: 'Indicadores sociales',
    href: '/indicadores-sociales',
    icon: <ChartBar size={18} />,
  },
  {
    label: 'Usuarios',
    href: '/usuarios',
    icon: <Users size={18} />,
  },
];

const publicMenuGroups: Array<MenuGroup> = [
  {
    label: 'Institucional',
    items: institucionalItems,
  },
  {
    label: 'Información minera',
    items: informacionMineraItems,
  },
  {
    label: 'Servicios y formación',
    items: serviciosFormacionItems,
  },
];

const adminMenuGroup: MenuGroup = {
  label: 'Administración',
  items: administracionItems,
};

export const PanelLateral = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { usuario } = rootRoute.useRouteContext();

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
          Inicio
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
                  {group.label}
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
                      {item.label}
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
              <p className="text-xl font-bold">Menú SIMLaR</p>
            </DrawerHeader>

            <DrawerBody className="flex flex-col gap-4">
              <Listbox aria-label="Inicio">
                <ListboxItem
                  key="/"
                  href="/"
                  color="danger"
                  startContent={<House size={18} />}
                  className={pathname === '/' ? 'text-danger font-semibold' : ''}
                >
                  Inicio
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
                    {group.label}
                  </p>

                  <Listbox aria-label={group.label}>
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
                          {item.label}
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
