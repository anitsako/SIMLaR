import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import { CircleUserRound } from 'lucide-react'
import { PanelLateral } from './panel-lateral'
import logoGob from '@/assets/branding/la-rioja-gobierno.png'

export const AppBar = () => {
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
              <p className="text-sm text-default-500">
                Sistema de Información Minera La Rioja
              </p>
            </div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="success" startContent={<CircleUserRound />}>
            Ingresar
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}