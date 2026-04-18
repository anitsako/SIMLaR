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
import { useState } from 'react';
import { BookOpenText, Edit } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ProyectoMineroModal } from './proyecto-minero.modal';
import { useProyectosMinerosCount } from './use-proyectos-mineros-count';
import { useProyectosMineros } from '@/proyectos-mineros/use-proyectos-mineros';
import { decimalToDms } from '@/common/decimal-to-dms';

export const ProyectosMinerosTable = () => {
  const { nombreLike, page, pageSize } = useSearch({ from: '/proyectos-mineros/' });
  const navigate = useNavigate({ from: '/proyectos-mineros/' });
  const {
    data: proyectosMineros,
    isFetching: isProyectosMinerosFetching,
    error,
  } = useProyectosMineros({ nombreLike, limit: pageSize, offset: (page - 1) * pageSize });
  const { data: proyectosMinerosCount, isFetching: isProyectosMinerosCountFetching } = useProyectosMinerosCount({
    nombreLike,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const totalPages = Math.ceil(proyectosMinerosCount / pageSize);

  if (error) {
    console.error(error);
    return <div>Error al cargar los proyectos</div>;
  }

  if (isProyectosMinerosFetching || isProyectosMinerosCountFetching) {
    return <div className="flex align-center justify-center text-lg">Cargando proyectos...</div>;
  }

  if (proyectosMineros.length === 0) {
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
              total={totalPages}
              onChange={(p) =>
                navigate({
                  search: (prev) => ({ ...prev, page: p }),
                })
              }
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
          <TableColumn key="etapa.nombre">ETAPA</TableColumn>
          <TableColumn key="propietario">PROPIETARIO</TableColumn>
          <TableColumn key="coordenadas">COORDENADAS</TableColumn>
          <TableColumn key="detalles">DETALLES</TableColumn>
        </TableHeader>
        <TableBody items={proyectosMineros}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'tipo.nombre' ? item.tipo.nombre : ''}
                  {columnKey === 'etapa.nombre' ? item.etapa.nombre : ''}
                  {columnKey === 'coordenadas'
                    ? `${decimalToDms(item.coordenadasGeograficas[1], true)}, ${decimalToDms(item.coordenadasGeograficas[0], false)}`
                    : getKeyValue(item, columnKey)}
                  {columnKey === 'detalles' && (
                    <div className="flex items-center gap-2">
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
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="secondary"
                        onPress={() =>
                          navigate({
                            to: '/proyectos-mineros/$id/modificar',
                            params: { id: item.id.toString() },
                          })
                        }
                      >
                        <Edit />
                      </Button>
                    </div>
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
