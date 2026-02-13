import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
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
  Link,
  MenuIcon,
  Newspaper,
  Pickaxe,
  Settings,
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
              <ListboxItem color="primary" startContent={<Link />}>
                <a href="http://www.catastrolr.com.ar/home.php" target="_blank">
                  Catastro minero
                </a>
              </ListboxItem>
              <ListboxItem href="/datos-abiertos" color="primary" startContent={<Braces />}>
                Datos abiertos
              </ListboxItem>
              <ListboxItem href="/servicios" color="primary" startContent={<Briefcase />}>
                Servicios
              </ListboxItem>
              <ListboxItem href="/transparencia" color="primary" startContent={<Blend />}>
                Transparencia
              </ListboxItem>
              <ListboxItem href="/noticias" color="primary" startContent={<Newspaper />}>
                Noticias
              </ListboxItem>
              <ListboxItem href="/contacto" color="primary" startContent={<ContactRound />}>
                Contacto
              </ListboxItem>
            </Listbox>
            <Listbox className="mb-2">
              <ListboxItem href="/configuraciones" color="primary" startContent={<Settings />}>
                Configuración
              </ListboxItem>
            </Listbox>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
