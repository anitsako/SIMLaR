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
import SectionTitle from '@/common/section-title';
import { useCatastroHistorico } from '@/catastro-historico/use-catastro-historico';
import { ArchivoField } from '@/common/archivo.field';
import { addCatastroHistoricoArchivoFn } from '@/catastro-historico/add-catastro-historico-archivo.fn';
import { deleteCatastroHistoricoFn } from '@/catastro-historico/delete-catastro-historico.fn';

export const Route = createFileRoute('/_authed/catastro-historico/administrar/')({
  component: RouteComponent,
});

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function RouteComponent() {
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
        title: 'Registro agregado',
        description: 'El registro fue creado correctamente',
        color: 'success',
        variant: 'flat',
      });
      queryClient.invalidateQueries({ queryKey: ['catastro-historico'] });
      (crearModal.onClose(), setData({ anio: new Date().getFullYear(), mes: 0, archivo: undefined }));
    },
    onError: (err) => {
      const esDuplicado = err.message.includes('23505') || err.message.toLowerCase().includes('unique');

      addToast({
        title: esDuplicado ? 'Registro duplicado' : 'Error al guardar',
        description: esDuplicado
          ? 'Ya existe un archivo cargado para ese año y mes.'
          : 'No se pudo crear el registro. Intentá de nuevo.',
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
        title: 'Registro eliminado',
        description: 'La fila se eliminó correctamente',
        color: 'success',
        variant: 'flat',
      });
      queryClient.invalidateQueries({ queryKey: ['catastro-historico'] });
      borrarModal.onClose();
      setFilaABorrar(null);
    },
    onError: () => {
      addToast({
        title: 'No se pudo eliminar el registro',
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

  if (isPending) return <div className="flex justify-center">Cargando catastro...</div>;
  if (isError) return <p>No se pudo cargar el catastro histórico.</p>;
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
      addToast({ title: 'Falta el archivo', color: 'danger', variant: 'flat' });
      return;
    }

    const yaExiste = catastro.some((c) => c.anio === data.anio && c.meses.some((m) => m.mes === data.mes));

    if (yaExiste) {
      addToast({
        title: 'Registro duplicado',
        description: 'Ya existe un archivo para ese año y mes.',
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
        title="Administrar Catastro Histórico"
        rightSlot={
          <Button color="primary" size="sm" onPress={crearModal.onOpen}>
            Crear
          </Button>
        }
      />
      <Modal isOpen={crearModal.isOpen} placement="top-center" onClose={crearModal.onClose}>
        <ModalContent>
          <Form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Agregar Registro</ModalHeader>
            <ModalBody>
              <div className="flex flex-col justify-center gap-3">
                <NumberInput
                  value={data.anio}
                  minValue={2020}
                  maxValue={new Date().getFullYear()}
                  label="Año"
                  isRequired
                  onValueChange={(v) => setData((d) => ({ ...d, anio: v }))}
                />
                <Select
                  className="max-w-sm"
                  label="Selecciona el mes"
                  isRequired
                  selectedKeys={data.mes ? [String(data.mes)] : []}
                  onSelectionChange={(keys) => setData((d) => ({ ...d, mes: Number([...keys][0]) }))}
                >
                  {meses.map((mes, idx) => (
                    <SelectItem key={String(idx + 1)}>{mes}</SelectItem>
                  ))}
                </Select>
                <ArchivoField
                  required
                  accept=".dwg"
                  label="Selecciona el archivo"
                  onChange={(f) => setData((d) => ({ ...d, archivo: f }))}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Guardar
              </Button>

              <Button color="danger" variant="flat" onPress={crearModal.onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
      {/* Modal para borrar */}
      <Modal isOpen={borrarModal.isOpen} placement="top-center" onClose={borrarModal.onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Eliminar Registro</ModalHeader>
          <ModalBody>
            <p>
              ¿Seguro que querés borrar el registro de{' '}
              <strong>
                {filaABorrar && meses[filaABorrar.mes - 1]} {filaABorrar?.anio}
              </strong>
              ? Se eliminará también el archivo.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleBorrar} isLoading={borrando}>
              Borrar
            </Button>

            <Button color="danger" variant="flat" onPress={borrarModal.onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Table aria-label="Tabla de catastro histórico" className="my-5">
        <TableHeader>
          <TableColumn>AÑO</TableColumn>
          <TableColumn>MES</TableColumn>
          <TableColumn>ARCHIVO</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No hay archivos cargados todavía.">
          {filas.map((fila) => (
            <TableRow key={fila.key}>
              <TableCell>{fila.anio}</TableCell>
              <TableCell>{meses[fila.mes - 1]}</TableCell>
              <TableCell>
                <a
                  href={`/archivos/${fila.archivoId}/${fila.nombre}`}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ArrowDownToLine size={16} /> Descargar
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
