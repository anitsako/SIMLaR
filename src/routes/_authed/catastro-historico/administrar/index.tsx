import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
  useDisclosure,
} from '@heroui/react';
import { ArrowDownToLine, Trash2 } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';
import i18n from '@/i18n';
import { useCatastroHistorico } from '@/catastro-historico/use-catastro-historico';
import { ArchivoField } from '@/common/archivo.field';
import { addCatastroHistoricoArchivoFn } from '@/catastro-historico/add-catastro-historico-archivo.fn';
import { deleteCatastroHistoricoFn } from '@/catastro-historico/delete-catastro-historico.fn';

export const Route = createFileRoute('/_authed/catastro-historico/administrar/')({
  beforeLoad: ({ context }) => { if (!context.usuario?.esAdmin) throw new Error(i18n.t('common.errores.requiereAdmin')); },
  component: RouteComponent,
});

const meses = [
  'common.meses.enero',
  'common.meses.febrero',
  'common.meses.marzo',
  'common.meses.abril',
  'common.meses.mayo',
  'common.meses.junio',
  'common.meses.julio',
  'common.meses.agosto',
  'common.meses.septiembre',
  'common.meses.octubre',
  'common.meses.noviembre',
  'common.meses.diciembre',
];

function RouteComponent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: catastro, isPending, isError } = useCatastroHistorico();
  const crearModal = useDisclosure();
  const borrarModal = useDisclosure();

  const [data, setData] = useState({
    anio: new Date().getFullYear(),
    mes: 0,
    archivo: undefined as File | undefined,
  });
  const addCatastroHistorico = useServerFn(addCatastroHistoricoArchivoFn);
  const deleteCatastroHistorico = useServerFn(deleteCatastroHistoricoFn);

  const { mutate: agregarCatastroHistorico } = useMutation({
    mutationFn: addCatastroHistorico,
    onSuccess: () => {
      addToast({
        title: t('routes.admin.catastroHistorico.agregadoTitulo'),
        description: t('routes.admin.catastroHistorico.agregadoDescripcion'),
        color: 'success',
        variant: 'flat',
      });
      queryClient.invalidateQueries({ queryKey: ['catastro-historico'] });
      (crearModal.onClose(), setData({ anio: new Date().getFullYear(), mes: 0, archivo: undefined }));
    },
    onError: (err) => {
      const esDuplicado = err.message.includes('23505') || err.message.toLowerCase().includes('unique');

      addToast({
        title: esDuplicado ? t('routes.admin.catastroHistorico.duplicadoTitulo') : t('routes.admin.catastroHistorico.errorGuardarTitulo'),
        description: esDuplicado
          ? t('routes.admin.catastroHistorico.duplicadoServidor')
          : t('routes.admin.catastroHistorico.errorGuardarDescripcion'),
        color: 'danger',
        variant: 'flat',
      });
    },
  });
  const [filaABorrar, setFilaABorrar] = useState<{ id: number; anio: number; mes: number } | null>(null);

  const { mutate: borrarCatastroHistorico, isPending: borrando } = useMutation({
    mutationFn: deleteCatastroHistorico,
    onSuccess: () => {
      addToast({
        title: t('routes.admin.catastroHistorico.eliminadoTitulo'),
        description: t('routes.admin.catastroHistorico.eliminadoDescripcion'),
        color: 'success',
        variant: 'flat',
      });
      queryClient.invalidateQueries({ queryKey: ['catastro-historico'] });
      borrarModal.onClose();
      setFilaABorrar(null);
    },
    onError: () => {
      addToast({
        title: t('routes.admin.catastroHistorico.errorEliminarTitulo'),
        color: 'danger',
        variant: 'flat',
      });
    },
  });

  const handleBorrar = () => {
    if (!filaABorrar) return;
    console.log('Borrando fila: ', filaABorrar);
    borrarCatastroHistorico({ data: { id: filaABorrar.id } });
  };

  if (isPending) return <div className="flex justify-center">{t('routes.admin.catastroHistorico.cargando')}</div>;
  if (isError) return <p>{t('routes.admin.catastroHistorico.error')}</p>;
  const filas = catastro.flatMap((cat) =>
    cat.meses.map((m) => ({
      key: `${cat.anio}-${m.mes}`,
      id: m.id,
      anio: cat.anio,
      mes: m.mes,
      archivoId: m.archivoId,
      nombre: m.nombre,
    }))
  );

  const base64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('SUBMIT DISPARADO: ', data);

    if (!data.archivo) {
      addToast({ title: t('routes.admin.catastroHistorico.faltaArchivo'), color: 'danger', variant: 'flat' });
      return;
    }

    const yaExiste = catastro.some((c) => c.anio === data.anio && c.meses.some((m) => m.mes === data.mes));

    if (yaExiste) {
      addToast({
        title: t('routes.admin.catastroHistorico.duplicadoTitulo'),
        description: t('routes.admin.catastroHistorico.duplicadoDescripcion'),
        color: 'danger',
        variant: 'flat',
      });
      return;
    }
    const archivoBase64 = await base64(data.archivo);
    agregarCatastroHistorico({
      data: {
        anio: Number(data.anio),
        mes: Number(data.mes),
        archivo: {
          nombre: data.archivo.name,
          tamaño: data.archivo.size,
          mimeType: 'image/vnd.dwg',
          base64: archivoBase64,
        },
      },
    });
  };
  return (
    <div>
      <SectionTitle
        title={t('routes.admin.catastroHistorico.page.title')}
        rightSlot={
          <Button color="primary" size="sm" onPress={crearModal.onOpen}>
            {t('common.acciones.crear')}
          </Button>
        }
      />
      <Modal isOpen={crearModal.isOpen} placement="top-center" onClose={crearModal.onClose}>
        <ModalContent>
          <Form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">{t('routes.admin.catastroHistorico.modal.agregarTitulo')}</ModalHeader>
            <ModalBody>
              <div className="flex flex-col justify-center gap-3">
                <NumberInput
                  value={data.anio}
                  minValue={2020}
                  maxValue={new Date().getFullYear()}
                  label={t('routes.admin.catastroHistorico.modal.anio')}
                  isRequired
                  onValueChange={(v) => setData((d) => ({ ...d, anio: v }))}
                />
                <Select
                  className="max-w-sm"
                  label={t('routes.admin.catastroHistorico.modal.mes')}
                  isRequired
                  selectedKeys={data.mes ? [String(data.mes)] : []}
                  onSelectionChange={(keys) => setData((d) => ({ ...d, mes: Number([...keys][0]) }))}
                >
                  {meses.map((mes, idx) => (
                    <SelectItem key={String(idx + 1)}>{t(mes)}</SelectItem>
                  ))}
                </Select>
                <ArchivoField
                  required
                  accept=".dwg"
                  label={t('routes.admin.catastroHistorico.modal.archivo')}
                  onChange={(f) => setData((d) => ({ ...d, archivo: f }))}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                {t('common.acciones.guardar')}
              </Button>

              <Button color="danger" variant="flat" onPress={crearModal.onClose}>
                {t('common.acciones.cancelar')}
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
      {/* Modal para borrar */}
      <Modal isOpen={borrarModal.isOpen} placement="top-center" onClose={borrarModal.onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{t('routes.admin.catastroHistorico.modal.eliminarTitulo')}</ModalHeader>
          <ModalBody>
            <p>
              <Trans
                i18nKey="routes.admin.catastroHistorico.modal.confirmarBorrar"
                values={{ mes: filaABorrar ? t(meses[filaABorrar.mes - 1]) : '', anio: filaABorrar?.anio ?? '' }}
                components={{ b: <strong /> }}
              />
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleBorrar} isLoading={borrando}>
              {t('common.acciones.borrar')}
            </Button>

            <Button color="danger" variant="flat" onPress={borrarModal.onClose}>
              {t('common.acciones.cancelar')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Table aria-label={t('routes.admin.catastroHistorico.tabla.aria')} className="my-5">
        <TableHeader>
          <TableColumn>{t('routes.admin.catastroHistorico.tabla.anio')}</TableColumn>
          <TableColumn>{t('routes.admin.catastroHistorico.tabla.mes')}</TableColumn>
          <TableColumn>{t('routes.admin.catastroHistorico.tabla.archivo')}</TableColumn>
          <TableColumn>{t('routes.admin.catastroHistorico.tabla.acciones')}</TableColumn>
        </TableHeader>

        <TableBody emptyContent={t('routes.admin.catastroHistorico.tabla.vacio')}>
          {filas.map((fila) => (
            <TableRow key={fila.key}>
              <TableCell>{fila.anio}</TableCell>
              <TableCell>{t(meses[fila.mes - 1])}</TableCell>
              <TableCell>
                <a
                  href={`/archivos/${fila.archivoId}/${fila.nombre}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ArrowDownToLine size={16} /> {t('common.acciones.descargar')}
                </a>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => {
                    setFilaABorrar(fila);
                    borrarModal.onOpen();
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
