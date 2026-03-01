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
  useDisclosure,
} from '@heroui/react';
import { useMemo, useState } from 'react';
import { BookOpenText } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { ProyectoMineroModal } from './proyecto-minero.modal';
import { useProyectosMineros } from '@/proyectos-mineros/use-proyectos-mineros';
import { decimalToDms } from '@/common/decimal-to-dms';

export const ProyectosMinerosTable = () => {
  const { nombreLike } = useSearch({ from: '/proyectos-mineros/' });
  const { data, isFetching, error } = useProyectosMineros({ nombreLike });
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const rowsPerPage = 8;

  const pages = Math.ceil((data.length || 0) / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  if (error) {
    return <div>Error al cargar los proyectos</div>;
  }

  if (isFetching) {
    return <div className="flex align-center justify-center text-lg">Cargando proyectos...</div>;
  }

  if (data.length === 0) {
    return <div className="flex align-center justify-center text-xl">No hay proyectos para mostrar</div>;
  }

  return (
    <>
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
          <TableColumn key="nombre">NOMBRE</TableColumn>
          <TableColumn key="tipo.nombre">TIPO</TableColumn>
          <TableColumn key="ubicacion">UBICACION</TableColumn>
          <TableColumn key="mineral">MINERAL</TableColumn>
          <TableColumn key="etapa">ETAPA</TableColumn>
          <TableColumn key="propietario">PROPIETARIO</TableColumn>
          <TableColumn key="coordenadas">COORDENADAS</TableColumn>
          <TableColumn key="detalles">DETALLES</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'tipo.nombre' ? item.tipo.nombre : ''}
                  {columnKey === 'coordenadas'
                    ? `${decimalToDms(item.coordenadasGeograficas[1], true)}, ${decimalToDms(item.coordenadasGeograficas[0], false)}`
                    : getKeyValue(item, columnKey)}
                  {columnKey === 'detalles' && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => {
                        setSelectedId(item.id);
                        onOpen();
                      }}
                    >
                      <BookOpenText />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ProyectoMineroModal id={selectedId} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
