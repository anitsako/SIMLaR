import { Link, getRouteApi } from '@tanstack/react-router';
import { Accordion, AccordionItem, Button } from '@heroui/react';
import { ArrowDownToLine } from 'lucide-react';
import { useCatastroHistorico } from '@/catastro-historico/use-catastro-historico';

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

const rootRoute=getRouteApi('__root__');

export function CatastroHistoricoSeccion() {
  const {usuario}=rootRoute.useRouteContext();
  const { data: catastro, isPending, isError } = useCatastroHistorico();

  if (isPending) return <p role="status">Cargando catastro histórico…</p>;
  if (isError) return <p role="alert">No se pudo cargar el catastro histórico. El visor minero de arriba sigue disponible.</p>;

  return (
    <div>
      {usuario?.esAdmin && <div className="mb-4 flex justify-end">
        <Button as={Link} to="/catastro-historico/administrar" color="primary" size="sm">
          Administrar registros
        </Button>
      </div>}

      <div className="mx-auto flex w-full max-w-md flex-col mt-5 mb-5">
        {catastro.length === 0 && <p className="text-default-600">No hay registros cargados todavía.</p>}
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
                    <div key={fila.mes} className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-neutral-600">{meses[fila.mes - 1]}</span>
                      <a
                        href={`/archivos/${fila.archivoId}/${encodeURIComponent(fila.nombre)}`}
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
