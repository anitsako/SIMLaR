import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { CircleUserRound } from 'lucide-react';
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
      <NavbarMenu className="bg-default-50 max-w-xs border rounded-md">
        <NavbarMenuItem>Opción 1</NavbarMenuItem>
        <NavbarMenuItem>Opción 2</NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
