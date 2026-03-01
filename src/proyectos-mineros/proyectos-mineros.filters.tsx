import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@heroui/react';
import { SlidersHorizontal } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { FiltrarPorTextoModal } from '@/common/filtros/filtrar-por-texto.modal';

export function ProyectosMinerosFilters() {
  const { nombreLike } = useSearch({ from: '/proyectos-mineros/' });
  const navigate = useNavigate({ from: '/proyectos-mineros/' });
  const { isOpen: isFiltroNombreOpen, onOpen: onFiltroNombreOpen, onClose: onFiltroNombreClose } = useDisclosure();

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" variant="flat" startContent={<SlidersHorizontal size={16} />}>
            Filtros
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="nombreLike" onPress={onFiltroNombreOpen}>
            Filtrar por nombre
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {isFiltroNombreOpen && (
        <FiltrarPorTextoModal
          title="Filtrar por nombre"
          label="Nombre contiene"
          textoActual={nombreLike || ''}
          isOpen={isFiltroNombreOpen}
          onClose={onFiltroNombreClose}
          onAplicar={(texto) => navigate({ search: (prev) => ({ ...prev, nombreLike: texto || undefined }) })}
        />
      )}
    </>
  );
}
