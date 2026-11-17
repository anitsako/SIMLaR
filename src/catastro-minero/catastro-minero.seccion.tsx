import { ClientOnly } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEdicionesCatastro, urlArchivoEdicion } from './use-ediciones';

const CatastroViewer = lazy(() =>
  import('./CatastroViewer').then((module) => ({ default: module.CatastroViewer })),
);

function LoadingMap() {
  const { t } = useTranslation();
  return <div className="flex min-h-88 items-center justify-center rounded-xl border bg-default-50" role="status">{t('routes.catastro.minero.cargandoVisor')}</div>;
}

export function CatastroMineroSeccion() {
  const { t } = useTranslation();
  const {data, isPending, isError} = useEdicionesCatastro();
  if(isPending) return <LoadingMap/>;
  if(isError) return <p role="alert">{t('routes.catastro.minero.errorEdicion')}</p>;
  const actual=data[0];
  const urls=actual?[urlArchivoEdicion(actual.geojsonId,actual.fechaCorte,'geojson')]:['/catastro-minero/catastro-minero.geojson'];
  const descargas=actual
    ? [{ext:'dwg',id:actual.dwgId},{ext:'pdf',id:actual.pdfId}].filter(x=>x.id).map(x=>({ext:x.ext,url:urlArchivoEdicion(x.id!,actual.fechaCorte,x.ext)}))
    : ['dwg','pdf'].map(ext=>({ext,url:`/catastro-minero/catastro-minero.${ext}`}));
  return (
    <div className="mt-4 space-y-6 pb-8">
      <header><h2 className="text-2xl font-semibold">{t('routes.catastro.minero.title')}</h2><p className="mt-1 text-default-600">{t('routes.catastro.minero.subtitle')}</p></header>

      <p className="max-w-4xl text-default-600">
        {t('routes.catastro.minero.instrucciones')}
      </p>

      <div className="rounded-xl border border-warning-200 bg-warning-50 px-5 py-4 text-sm text-default-700">
        {actual ? <><strong>{actual.titulo}</strong> · {t('routes.catastro.minero.fechaCorte', { fecha: actual.fechaCorte })}
          {actual.observaciones && <p className="mt-2 whitespace-pre-wrap">{actual.observaciones}</p>}</>
          : <>{t('routes.catastro.minero.recepcionInicial')}</>}
        <p className="mt-2">{t('routes.catastro.minero.estadoVigente')}</p>
      </div>

      <ClientOnly fallback={<LoadingMap />}>
        <Suspense fallback={<LoadingMap />}>
          <CatastroViewer geojsonUrls={urls} title={t('routes.catastro.minero.visorTitle')} />
        </Suspense>
      </ClientOnly>

      <section aria-labelledby="catastro-descargas" className="rounded-xl border p-5 sm:p-6">
        <h2 id="catastro-descargas" className="text-xl font-semibold">{t('routes.catastro.minero.descargasTitle')}</h2>
        <p className="mt-2 text-sm text-default-600">{t('routes.catastro.minero.descargasDescripcion')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {descargas.map(({ext:format,url}) => (
            <a key={format} href={url} download
              className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2">
              <Download size={18} aria-hidden="true" /> {t('routes.catastro.minero.descargar', { formato: format.toUpperCase() })}
            </a>
          ))}
        </div>
        {!descargas.length && <p className="mt-3 text-sm text-default-600">{t('routes.catastro.minero.sinDescargas')}</p>}
      </section>


    </div>
  );
}
