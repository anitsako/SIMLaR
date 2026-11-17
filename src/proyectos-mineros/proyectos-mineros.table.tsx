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
import { useTranslation } from 'react-i18next';
import { BookOpenText, Edit, Files } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { ProyectoMineroModal } from './proyecto-minero.modal';
import { useProyectosMinerosCount } from './use-proyectos-mineros-count';
import { useProyectosMineros } from './use-proyectos-mineros';
import { decimalToDms } from '@/common/decimal-to-dms';

export const ProyectosMinerosTable = ({
  visibleBase,
}: {
  visibleBase?: boolean;
}) => {
  const { t } = useTranslation();
  const {
    nombreLike,
    tiposIds,
    etapasIds,
    minerales,
    ubicaciones,
    propietarios,
    provinciasGeologicas,
    convenioEmse,
    estadoVisible,
    msnmDesde,
    msnmHasta,
    page,
    pageSize,
  } = useSearch({
    from: '/proyectos-mineros/',
  });

  const navigate = useNavigate({
    from: '/proyectos-mineros/',
  });

  const visibleConsulta = visibleBase ?? estadoVisible;

  const filtros = {
    nombreLike,
    tiposIds,
    etapasIds,
    minerales,
    ubicaciones,
    propietarios,
    provinciasGeologicas,
    convenioEmse,
    visible: visibleConsulta,
    msnmDesde,
    msnmHasta,
  };

  const {
    data: proyectosMineros,
    isFetching: isProyectosMinerosFetching,
    error,
  } = useProyectosMineros({
    ...filtros,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  const {
    data: proyectosMinerosCount,
    isFetching: isProyectosMinerosCountFetching,
  } = useProyectosMinerosCount(filtros);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const totalPages = Math.max(
    1,
    Math.ceil(proyectosMinerosCount / pageSize)
  );

  if (error) {
    console.error(error);
    return <div>{t('routes.proyectosMineros.tabla.error')}</div>;
  }

  if (
    isProyectosMinerosFetching ||
    isProyectosMinerosCountFetching
  ) {
    return (
      <div className="flex items-center justify-center text-lg">
        {t('routes.proyectosMineros.tabla.cargando')}
      </div>
    );
  }

  if (proyectosMineros.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-xl">
        {t('routes.proyectosMineros.tabla.vacio')}
      </div>
    );
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
              page={Math.min(page, totalPages)}
              total={totalPages}
              onChange={(nuevaPagina) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    page: nuevaPagina,
                  }),
                })
              }
            />
          </div>
        }
        classNames={{
          wrapper: 'min-h-[400px]',
        }}
      >
        <TableHeader>
          <TableColumn key="nombre">{t('routes.proyectosMineros.tabla.columnas.nombre')}</TableColumn>
          <TableColumn key="tipo.nombre">{t('routes.proyectosMineros.tabla.columnas.tipo')}</TableColumn>
          <TableColumn key="ubicacion">{t('routes.proyectosMineros.tabla.columnas.ubicacion')}</TableColumn>
          <TableColumn key="mineral">{t('routes.proyectosMineros.tabla.columnas.mineral')}</TableColumn>
          <TableColumn key="etapa.nombre">{t('routes.proyectosMineros.tabla.columnas.etapa')}</TableColumn>
          <TableColumn key="propietario">{t('routes.proyectosMineros.tabla.columnas.propietario')}</TableColumn>
          <TableColumn key="coordenadas">{t('routes.proyectosMineros.tabla.columnas.coordenadas')}</TableColumn>
          <TableColumn key="detalles">{t('routes.proyectosMineros.tabla.columnas.detalles')}</TableColumn>
        </TableHeader>

        <TableBody items={proyectosMineros}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'tipo.nombre' && item.tipo.nombre}

                  {columnKey === 'etapa.nombre' && item.etapa.nombre}

                  {columnKey === 'coordenadas' &&
                    `${decimalToDms(
                      item.coordenadasGeograficas[1],
                      true
                    )}, ${decimalToDms(
                      item.coordenadasGeograficas[0],
                      false
                    )}`}

                  {columnKey !== 'tipo.nombre' &&
                    columnKey !== 'etapa.nombre' &&
                    columnKey !== 'coordenadas' &&
                    columnKey !== 'detalles' &&
                    getKeyValue(item, columnKey)}

                  {columnKey === 'detalles' && (
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label={t('routes.proyectosMineros.tabla.verDetallesAria', { nombre: item.nombre })}
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
                        aria-label={t('routes.proyectosMineros.tabla.modificarAria', { nombre: item.nombre })}
                        onPress={() =>
                          navigate({
                            to: '/proyectos-mineros/$id/modificar',
                            params: {
                              id: item.id.toString(),
                            },
                          })
                        }
                      >
                        <Edit />
                      </Button>

                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="secondary"
                        aria-label={t('routes.proyectosMineros.tabla.archivosAria', { nombre: item.nombre })}
                        onPress={() =>
                          navigate({
                            to: '/proyectos-mineros/$id/archivos',
                            params: {
                              id: item.id.toString(),
                            },
                          })
                        }
                      >
                        <Files />
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ProyectoMineroModal
        id={selectedId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
