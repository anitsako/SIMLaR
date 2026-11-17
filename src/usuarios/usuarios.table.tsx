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
import { KeyRound, SquarePen } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useUsuarios } from './use-usuarios';

export const UsuariosTable = () => {
  const { t } = useTranslation();
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
    return <div>{t('routes.admin.usuarios.tabla.error')}</div>;
  }

  if (isFetching) {
    return <div className="flex align-center justify-center text-lg">{t('routes.admin.usuarios.tabla.cargando')}</div>;
  }

  if (data.length === 0) {
    return <div className="flex align-center justify-center text-xl">{t('routes.admin.usuarios.tabla.vacio')}</div>;
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
        <TableColumn key="id">{t('routes.admin.usuarios.tabla.columnas.id')}</TableColumn>
        <TableColumn key="nombreCompleto">{t('routes.admin.usuarios.tabla.columnas.nombreCompleto')}</TableColumn>
        <TableColumn key="username">{t('routes.admin.usuarios.tabla.columnas.username')}</TableColumn>
        <TableColumn key="email">{t('routes.admin.usuarios.tabla.columnas.email')}</TableColumn>
        <TableColumn key="esAdmin">{t('routes.admin.usuarios.tabla.columnas.esAdmin')}</TableColumn>
        <TableColumn key="acciones">{t('routes.admin.usuarios.tabla.columnas.acciones')}</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === 'nombreCompleto' ? `${item.apellido}, ${item.nombre}` : getKeyValue(item, columnKey)}
                {columnKey === 'esAdmin' && (item.esAdmin ? t('common.si') : t('common.no'))}
                {columnKey === 'acciones' && (
                  <div className="flex items-center gap-2">
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
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="secondary"
                      onPress={() =>
                        navigate({
                          to: '/usuarios/$id/cambiar-contraseña',
                          params: { id: item.id.toString() },
                        })
                      }
                    >
                      <KeyRound />
                    </Button>
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
