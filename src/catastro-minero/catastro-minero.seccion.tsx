import { ClientOnly } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { Download } from 'lucide-react';
import { useEdicionesCatastro, urlArchivoEdicion } from './use-ediciones';

const CatastroViewer = lazy(() =>
  import('./CatastroViewer').then((module) => ({ default: module.CatastroViewer })),
);

function LoadingMap() {
  return <div className="flex min-h-88 items-center justify-center rounded-xl border bg-default-50" role="status">Cargando visor catastral…</div>;
}

export function CatastroMineroSeccion() {
  const {data, isPending, isError} = useEdicionesCatastro();
  if(isPending) return <LoadingMap/>;
  if(isError) return <p role="alert">No se pudo consultar la edición actual del catastro. Intentá nuevamente más tarde.</p>;
  const actual=data[0];
  const urls=actual?[urlArchivoEdicion(actual.geojsonId,actual.fechaCorte,'geojson')]:['/catastro-minero/catastro-minero.geojson'];
  const descargas=actual
    ? [{ext:'dwg',id:actual.dwgId},{ext:'pdf',id:actual.pdfId}].filter(x=>x.id).map(x=>({ext:x.ext,url:urlArchivoEdicion(x.id!,actual.fechaCorte,x.ext)}))
    : ['dwg','pdf'].map(ext=>({ext,url:`/catastro-minero/catastro-minero.${ext}`}));
  return (
    <div className="mt-4 space-y-6 pb-8">
      <header><h2 className="text-2xl font-semibold">Catastro Minero</h2><p className="mt-1 text-default-600">Información catastral de la Secretaría de Minería</p></header>

      <p className="max-w-4xl text-default-600">
        Explorá las parcelas en el mapa. Seleccioná un polígono o un punto para consultar
        los datos disponibles. Cuando coincidan varias parcelas, el visor te permitirá elegir una.
      </p>

      <div className="rounded-xl border border-warning-200 bg-warning-50 px-5 py-4 text-sm text-default-700">
        {actual ? <><strong>{actual.titulo}</strong> · Fecha de corte: {actual.fechaCorte}.
          {actual.observaciones && <p className="mt-2 whitespace-pre-wrap">{actual.observaciones}</p>}</>
          : <>Esta vista muestra los archivos de la recepción inicial de la Secretaría de Minería. La fecha de corte está pendiente de confirmación.</>}
        <p className="mt-2">Para conocer el estado vigente de un derecho minero, consultá al organismo competente.</p>
      </div>

      <ClientOnly fallback={<LoadingMap />}>
        <Suspense fallback={<LoadingMap />}>
          <CatastroViewer geojsonUrls={urls} title="Visor del catastro minero de La Rioja" />
        </Suspense>
      </ClientOnly>

      <section aria-labelledby="catastro-descargas" className="rounded-xl border p-5 sm:p-6">
        <h2 id="catastro-descargas" className="text-xl font-semibold">Descargas del catastro</h2>
        <p className="mt-2 text-sm text-default-600">Archivos correspondientes a la edición que muestra el visor.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {descargas.map(({ext:format,url}) => (
            <a key={format} href={url} download
              className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2">
              <Download size={18} aria-hidden="true" /> Descargar {format.toUpperCase()}
            </a>
          ))}
        </div>
        {!descargas.length && <p className="mt-3 text-sm text-default-600">Esta edición no incluye PDF ni DWG. Las ediciones anteriores están disponibles en el histórico.</p>}
      </section>


    </div>
  );
}
