import { useTranslation } from 'react-i18next';
import { useEdicionesCatastro, urlArchivoEdicion } from '@/catastro-minero/use-ediciones';

export function EdicionesPublicadas() {
  const { t } = useTranslation();
  const {data, isPending, isError} = useEdicionesCatastro();
  if(isPending) return <p role="status">{t('routes.admin.catastro.ediciones.consultando')}</p>;
  if(isError) return <p role="alert">{t('routes.admin.catastro.ediciones.error')}</p>;
  return <div className="space-y-4">
    <h3 className="text-xl font-semibold">{t('routes.admin.catastro.ediciones.titulo')}</h3>
    {data.map((e,i)=><article key={e.id} className="rounded-xl border p-4">
      <h4 className="font-semibold">{e.titulo}{i===0?t('routes.admin.catastro.ediciones.enVisor'):''}</h4>
      <p className="mt-1 text-sm">{t('routes.admin.catastro.ediciones.fechas', { fecha: e.fechaCorte, publicacion: new Date(e.publicadaEn).toLocaleString('es-AR') })}</p>
      {e.observaciones && <p className="mt-2 whitespace-pre-wrap text-sm text-default-600">{e.observaciones}</p>}
      <div className="mt-3 flex flex-wrap gap-4">
        {([['geojson',e.geojsonId],['pdf',e.pdfId],['dwg',e.dwgId]] as const).map(([ext,id])=>id&&<a key={ext} href={urlArchivoEdicion(id,e.fechaCorte,ext)} className="text-primary underline" target="_blank" rel="noreferrer">{t('routes.admin.catastro.ediciones.descargar', { formato: ext.toUpperCase() })}</a>)}
      </div>
    </article>)}
    <article className="rounded-xl border p-4">
      <h4 className="font-semibold">{t('routes.admin.catastro.ediciones.recepcionTitulo')}</h4>
      <p className="mt-1 text-sm text-default-600">{t('routes.admin.catastro.ediciones.recepcionDescripcion')}</p>
      <div className="mt-3 flex flex-wrap gap-4">{['geojson','pdf','dwg'].map(ext=><a key={ext} href={`/catastro-minero/catastro-minero.${ext}`} className="text-primary underline" download>{t('routes.admin.catastro.ediciones.descargar', { formato: ext.toUpperCase() })}</a>)}</div>
    </article>
  </div>;
}
