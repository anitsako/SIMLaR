import React from 'react';
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
import { ModalTablaProyectos } from './tabla-proyectos-modal';
import { useProyectosMineros } from '@/proyectos-mineros/use-proyectos-mineros';

function decimalToDms(decimal: number, isLat: boolean): string {
  const dir = isLat ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'O';
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const minFull = (abs - deg) * 60;
  const min = Math.floor(minFull);
  const sec = ((minFull - min) * 60).toFixed(2);
  return `${deg}° ${min}' ${sec}" ${dir}`;
}

export default function TablaProyectos() {
  const { data = [], isLoading, error } = useProyectosMineros();
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 8;

  const pages = Math.ceil((data.length || 0) / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  if (error) return <div>Error al cargar los proyectos</div>;
  if (isLoading) return <div className="flex align-center justify-center text-lg">Cargando proyectos...</div>;

  return (
    <>
      {!data.length && <div className="flex align-center justify-center text-xl">No hay proyectos para mostrar</div>}
      {data.length > 0 && (
        <Table
          aria-label="Example table with client side pagination"
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
          classNames={{
            wrapper: 'min-h-[400px]',
          }}
        >
          <TableHeader>
            <TableColumn key="nombre">NOMBRE</TableColumn>
            <TableColumn key="tipo">TIPO</TableColumn>
            <TableColumn key="ubicacion">UBICACION</TableColumn>
            <TableColumn key="mineral">MINERAL</TableColumn>
            <TableColumn key="etapa">ETAPA</TableColumn>
            <TableColumn key="propietario">PROPIETARIO</TableColumn>
            <TableColumn key="coordenadas">COORDENADAS</TableColumn>
            <TableColumn key="detalles">DETALLES</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.nombre}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === 'coordenadas'
                      ? `${decimalToDms(item.coordenadasGeograficas[1], true)}, ${decimalToDms(item.coordenadasGeograficas[0], false)}`
                      : getKeyValue(item, columnKey)}
                    {columnKey === 'detalles' && <ModalTablaProyectos />}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
