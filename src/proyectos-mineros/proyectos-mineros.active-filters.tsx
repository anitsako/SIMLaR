import { Chip, useDisclosure } from '@heroui/react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { FiltrarPorTextoModal } from '@/common/filtros/filtrar-por-texto.modal';

export function ProyectosMinerosActiveFilters() {
  const { nombreLike } = useSearch({ from: '/proyectos-mineros/' });
  const navigate = useNavigate({ from: '/proyectos-mineros/' });
  const { isOpen: isFiltroNombreOpen, onOpen: onFiltroNombreOpen, onClose: onFiltroNombreClose } = useDisclosure();

  if (!nombreLike) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {nombreLike && (
        <>
          <Chip
            color="primary"
            variant="flat"
            onClose={() => navigate({ search: (prev) => ({ ...prev, nombreLike: undefined }) })}
            onClick={onFiltroNombreOpen}
            classNames={{ base: 'cursor-pointer' }}
          >
            Nombre: {nombreLike}
          </Chip>
          {isFiltroNombreOpen && (
            <FiltrarPorTextoModal
              title="Filtrar por nombre"
              label="Nombre contiene"
              textoActual={nombreLike}
              isOpen={isFiltroNombreOpen}
              onClose={onFiltroNombreClose}
              onAplicar={(texto) => navigate({ search: (prev) => ({ ...prev, nombreLike: texto || undefined }) })}
            />
          )}
        </>
      )}
    </div>
  );
}
