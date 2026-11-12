export interface EdicionHistorial {
  id: number;
  titulo: string;
  fechaCorte: string;
  geojsonId: string;
  pdfId: string | null;
  dwgId: string | null;
}

export interface ArchivoHistoricoAnual {
  anio: number;
  meses: { id: number; mes: number; archivoId: string; nombre: string }[];
}

export interface RegistroHistorial {
  id: string;
  fecha: string;
  fechaVisible: string;
  titulo: string;
  enVisor: boolean;
  orden: number;
  archivos: { formato: string; url: string }[];
}

const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

export function agruparHistorial(ediciones: readonly EdicionHistorial[], anteriores: readonly ArchivoHistoricoAnual[]) {
  const grupos = new Map<number, RegistroHistorial[]>();
  // La edición en el visor es la última publicada (id mayor), no la de mayor fecha de corte.
  const actualId = ediciones.reduce((max,e)=>Math.max(max,e.id),0);
  function agregar(anio:number, registro:RegistroHistorial) {
    if (!grupos.has(anio)) grupos.set(anio,[]);
    grupos.get(anio)!.push(registro);
  }
  for (const e of ediciones) {
    const [anio,mes,dia]=e.fechaCorte.split('-').map(Number);
    agregar(anio,{
      id:`edicion-${e.id}`,fecha:e.fechaCorte,fechaVisible:`${dia} de ${meses[mes-1] ?? mes}`,
      titulo:e.titulo,enVisor:e.id===actualId,orden:e.id,
      archivos:([['geojson',e.geojsonId],['pdf',e.pdfId],['dwg',e.dwgId]] as const)
        .flatMap(([ext,id])=>id?[{formato:ext.toUpperCase(),url:`/archivos/${id}/catastro-${e.fechaCorte}.${ext}`}]:[]),
    });
  }
  for (const a of anteriores) for (const m of a.meses) {
    const extension=m.nombre.split('.').pop()?.toUpperCase();
    agregar(a.anio,{
      id:`anterior-${m.id}`,fecha:`${a.anio}-${String(m.mes).padStart(2,'0')}-00`,
      fechaVisible:meses[m.mes-1] ?? `Mes ${m.mes}`,titulo:'Archivo catastral',enVisor:false,orden:m.id,
      archivos:[{formato:extension&&['PDF','DWG','ZIP','GEOJSON'].includes(extension)?extension:'Archivo',
        url:`/archivos/${m.archivoId}/${encodeURIComponent(m.nombre)}`}],
    });
  }
  return [...grupos.entries()].sort(([a],[b])=>b-a).map(([anio,registros])=>({
    anio,registros:registros.sort((a,b)=>b.fecha.localeCompare(a.fecha)||b.orden-a.orden),
  }));
}
