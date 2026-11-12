import { useEdicionesCatastro, urlArchivoEdicion } from '@/catastro-minero/use-ediciones';

export function EdicionesPublicadas() {
  const {data, isPending, isError} = useEdicionesCatastro();
  if(isPending) return <p role="status">Consultando ediciones publicadas…</p>;
  if(isError) return <p role="alert">No se pudo consultar el historial de ediciones.</p>;
  return <div className="space-y-4">
    <h3 className="text-xl font-semibold">Ediciones publicadas</h3>
    {data.map((e,i)=><article key={e.id} className="rounded-xl border p-4">
      <h4 className="font-semibold">{e.titulo}{i===0?' · En el visor':''}</h4>
      <p className="mt-1 text-sm">Fecha de corte: {e.fechaCorte} · Publicación: {new Date(e.publicadaEn).toLocaleString('es-AR')}</p>
      {e.observaciones && <p className="mt-2 whitespace-pre-wrap text-sm text-default-600">{e.observaciones}</p>}
      <div className="mt-3 flex flex-wrap gap-4">
        {([['geojson',e.geojsonId],['pdf',e.pdfId],['dwg',e.dwgId]] as const).map(([ext,id])=>id&&<a key={ext} href={urlArchivoEdicion(id,e.fechaCorte,ext)} className="text-primary underline" target="_blank" rel="noreferrer">Descargar {ext.toUpperCase()}</a>)}
      </div>
    </article>)}
    <article className="rounded-xl border p-4">
      <h4 className="font-semibold">Recepción inicial de la Secretaría</h4>
      <p className="mt-1 text-sm text-default-600">Archivos de origen conservados. Fecha de corte sin confirmar.</p>
      <div className="mt-3 flex flex-wrap gap-4">{['geojson','pdf','dwg'].map(ext=><a key={ext} href={`/catastro-minero/catastro-minero.${ext}`} className="text-primary underline" download>Descargar {ext.toUpperCase()}</a>)}</div>
    </article>
  </div>;
}
