import {
  Button,
  Listbox,
  ListboxItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
} from '@heroui/react';
import { Braces, Building, CircleUserRound, House, Link, Pickaxe } from 'lucide-react';
import { useState } from 'react';

export const AppBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar maxWidth="full" classNames={{ wrapper: 'px-4' }} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'} />
        <NavbarBrand>
          <div className="flex flex-col">
            <p className="text-3xl font-bold">SIMLaR</p>
            <p className="text-md text-default-500">Sistema de Información Minera La Rioja</p>
          </div>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" startContent={<CircleUserRound />}>
            Ingresar
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="max-w-xs border rounded-md">
        <Listbox>
          <ListboxItem href="/" color="primary" startContent={<House />}>
            Inicio
          </ListboxItem>
          <ListboxItem href="/institucional" color="primary" startContent={<Building />}>
            Institucional
          </ListboxItem>
          <ListboxItem href="/proyectos-mineros" color="primary" startContent={<Pickaxe />}>
            Proyectos mineros
          </ListboxItem>
          <ListboxItem color="primary" startContent={<Link />}>
            <a href="http://www.catastrolr.com.ar/home.php" target="_blank">
              Catastro minero
            </a>
          </ListboxItem>
          <ListboxItem href="/datos-abiertos" color="primary" startContent={<Braces />}>
            Datos abiertos
          </ListboxItem>
        </Listbox>
      </NavbarMenu>
    </Navbar>
  );
};
