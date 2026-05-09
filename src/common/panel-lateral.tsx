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
import {
  Blend,
  Braces,
  Briefcase,
  Building,
  ContactRound,
  House,
  Images,
  LibraryBig,
  Map,
  // Link,
  MenuIcon,
  // Newspaper,
  Pickaxe,
  Settings,
  Users,
} from 'lucide-react';

export const PanelLateral = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button className="bg-white" isIconOnly onPress={onOpen} variant="flat">
        <MenuIcon />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerContent className="max-w-xs">
          <DrawerHeader />
          <DrawerBody className="flex flex-col justify-between">
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
              {/*
              <ListboxItem color="primary" startContent={<Link />}>
                <a href="http://www.catastrolr.com.ar/home.php" target="_blank">
                  Catastro minero
                </a>
              </ListboxItem>
              */}
              <ListboxItem href="/datos-abiertos" color="primary" startContent={<Braces />}>
                Datos abiertos
              </ListboxItem>
              <ListboxItem href="/servicios" color="primary" startContent={<Briefcase />}>
                Servicios
              </ListboxItem>
              <ListboxItem href="/transparencia" color="primary" startContent={<Blend />}>
                Transparencia
              </ListboxItem>
              {/*
              <ListboxItem href="/noticias" color="primary" startContent={<Newspaper />}>
                Noticias
              </ListboxItem>
              */}
              <ListboxItem href="/educacion" color="primary" startContent={<LibraryBig />}>
                Educación minera
              </ListboxItem>
              <ListboxItem href="/mapas-geologicos" color="primary" startContent={<Map />}>
                Mapas geológicos
              </ListboxItem>
              <ListboxItem href="/contacto" color="primary" startContent={<ContactRound />}>
                Contacto
              </ListboxItem>
            </Listbox>
            <Dropdown className="mb-2" placement="right">
              <DropdownTrigger>
                <Button className=" justify-start" color="default" variant="light" startContent={<Settings />}>
                  Configuración
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="carrousel-imagenes" href="/carrousel-imagenes" startContent={<Images />}>
                  Carrousel de imágenes
                </DropdownItem>
                <DropdownItem key="usuarios" href="/usuarios" startContent={<Users />}>
                  Usuarios
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
