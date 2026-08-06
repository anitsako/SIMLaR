import { Link, createFileRoute } from '@tanstack/react-router';
import { Accordion, AccordionItem, Button } from '@heroui/react';
import { ArrowDownToLine } from 'lucide-react';
import SectionTitle from '@/common/section-title';
import { useCatastroHistorico } from '@/catastro-historico/use-catastro-historico';

export const Route = createFileRoute('/catastro-historico/')({
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
  const { data: catastro, isPending, isError } = useCatastroHistorico();

  if (isPending) return <div className="flex justify-center">Cargando catastro...</div>;
  if (isError) return <p>No se pudo cargar el catastro histórico.</p>;

  return (
    <div>
      <SectionTitle
        title="Catastro Histórico"
        rightSlot={
          <Button as={Link} to="administrar/" color="primary" size="sm">
            Administrar registros
          </Button>
        }
      />

      <div className="mx-auto flex w-full max-w-md flex-col mt-5 mb-5">
        {catastro.length === 0 && <SectionTitle title="No hay registros cargados todavía" />}
        {catastro.map((cat, idx) => (
          <div key={cat.anio} className="border-l-2 border-neutral-300">
            <div className="relative pl-6">
              <span className="absolute left-0 top-3 h-2 w-4 -translate-x-1/2 rounded-full bg-primary ring-3 ring-white" />

              <Accordion>
                <AccordionItem
                  classNames={{ title: 'text-4xl font-bold', base: 'w-full', trigger: 'cursor-pointer' }}
                  key={idx}
                  aria-label={String(cat.anio)}
                  title={String(cat.anio)}
                >
                  {cat.meses.map((fila) => (
                    <div key={fila.mes} className="grid grid-cols-[7rem_1fr_auto] items-center gap-42">
                      <span className="text-neutral-600">{meses[fila.mes - 1]}</span>
                      <a
                        href={`/archivos/${fila.archivoId}/${fila.nombre}`}
                        className="inline-flex items-center gap-2 shrink-0 rounded-md border border-neutral-200 p-2 m-2 hover:bg-neutral-50"
                      >
                        <ArrowDownToLine size={18} /> Descargar
                      </a>
                    </div>
                  ))}
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
