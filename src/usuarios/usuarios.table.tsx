import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@heroui/react';
import { useMemo, useState } from 'react';
import { SquarePen } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useUsuarios } from './use-usuarios';

export const UsuariosTable = () => {
  const { data, isFetching, error } = useUsuarios();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 8;

  const pages = Math.ceil((data.length || 0) / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  if (error) {
    return <div>Error al cargar los usuarios</div>;
  }

  if (isFetching) {
    return <div className="flex align-center justify-center text-lg">Cargando usuarios...</div>;
  }

  if (data.length === 0) {
    return <div className="flex align-center justify-center text-xl">No hay usuarios para mostrar</div>;
  }

  return (
    <Table
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(p) => setPage(p)}
          />
        </div>
      }
      classNames={{ wrapper: 'min-h-[400px]' }}
    >
      <TableHeader>
        <TableColumn key="id">ID</TableColumn>
        <TableColumn key="nombreCompleto">Nombre completo</TableColumn>
        <TableColumn key="username">Nombre de usuario</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="detalle">Detalles</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === 'nombreCompleto' ? `${item.apellido}, ${item.nombre}` : getKeyValue(item, columnKey)}
                {columnKey === 'detalle' && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() =>
                      navigate({
                        to: '/usuarios/$id/modificar',
                        params: { id: item.id.toString() },
                      })
                    }
                  >
                    <SquarePen />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
