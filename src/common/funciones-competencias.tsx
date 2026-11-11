import { Accordion, AccordionItem } from '@heroui/react';
import { UNIDADES_FUNCIONES, type UnidadFuncion } from './funciones-competencias.data';

function ListaFunciones({ funciones }: { funciones: Array<string> }) {
  if (funciones.length === 0) return null;

  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-black/80">
      {funciones.map((funcion, i) => (
        <li key={i}>{funcion}</li>
      ))}
    </ul>
  );
}

function RamaFuncion({ unidad }: { unidad: UnidadFuncion }) {
  return (
    <div className="mt-6 border-l-2 border-default-300 pl-4">
      <p className="font-semibold text-default-700">
        <span className="mr-1 text-black/50">{unidad.numero}</span>
        {unidad.titulo}
      </p>

      {unidad.dependeDe && <p className="mb-2 text-xs italic text-black/50">{unidad.dependeDe}</p>}

      <ListaFunciones funciones={unidad.funciones} />

      {unidad.hijos?.map((hijo) => (
        <RamaFuncion key={hijo.id} unidad={hijo} />
      ))}
    </div>
  );
}

export function FuncionesCompetencias() {
  return (
    <Accordion variant="splitted" selectionMode="multiple">
      {UNIDADES_FUNCIONES.map((unidad) => (
        <AccordionItem
          key={unidad.id}
          aria-label={unidad.titulo}
          title={`${unidad.numero} ${unidad.titulo}`}
          classNames={{ title: 'font-semibold' }}
        >
          <div className="pb-4">
            <ListaFunciones funciones={unidad.funciones} />

            {unidad.hijos?.map((hijo) => (
              <RamaFuncion key={hijo.id} unidad={hijo} />
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
