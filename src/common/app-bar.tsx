import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { CircleUserRound } from 'lucide-react';
import { PanelLateral } from './panel-lateral';

export const AppBar = () => {
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
        <NavbarItem>
          <Button color="primary" startContent={<CircleUserRound />}>
            Ingresar
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
