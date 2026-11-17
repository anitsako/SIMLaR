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

export interface EtiquetasHistorial {
  meses: readonly string[];
  fechaConDia: (dia: number, mes: string) => string;
  mesDesconocido: (mes: number) => string;
  archivoCatastral: string;
  archivo: string;
}

// Textos por defecto (español). La UI pasa los traducidos con i18n.
const ETIQUETAS_ES: EtiquetasHistorial = {
  meses: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  fechaConDia: (dia, mes) => `${dia} de ${mes}`,
  mesDesconocido: (mes) => `Mes ${mes}`,
  archivoCatastral: 'Archivo catastral',
  archivo: 'Archivo',
};

export function agruparHistorial(ediciones: readonly EdicionHistorial[], anteriores: readonly ArchivoHistoricoAnual[], etiquetas: EtiquetasHistorial = ETIQUETAS_ES) {
  const { meses } = etiquetas;
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
      id:`edicion-${e.id}`,fecha:e.fechaCorte,fechaVisible:etiquetas.fechaConDia(dia, meses[mes-1] ?? String(mes)),
      titulo:e.titulo,enVisor:e.id===actualId,orden:e.id,
      archivos:([['geojson',e.geojsonId],['pdf',e.pdfId],['dwg',e.dwgId]] as const)
        .flatMap(([ext,id])=>id?[{formato:ext.toUpperCase(),url:`/archivos/${id}/catastro-${e.fechaCorte}.${ext}`}]:[]),
    });
  }
  for (const a of anteriores) for (const m of a.meses) {
    const extension=m.nombre.split('.').pop()?.toUpperCase();
    agregar(a.anio,{
      id:`anterior-${m.id}`,fecha:`${a.anio}-${String(m.mes).padStart(2,'0')}-00`,
      fechaVisible:meses[m.mes-1] ?? etiquetas.mesDesconocido(m.mes),titulo:etiquetas.archivoCatastral,enVisor:false,orden:m.id,
      archivos:[{formato:extension&&['PDF','DWG','ZIP','GEOJSON'].includes(extension)?extension:etiquetas.archivo,
        url:`/archivos/${m.archivoId}/${encodeURIComponent(m.nombre)}`}],
    });
  }
  return [...grupos.entries()].sort(([a],[b])=>b-a).map(([anio,registros])=>({
    anio,registros:registros.sort((a,b)=>b.fecha.localeCompare(a.fecha)||b.orden-a.orden),
  }));
}
