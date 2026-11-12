import { describe, expect, it } from 'vitest';
import { agruparHistorial } from './agrupar-historial';

const edicion=(id:number,fechaCorte:string)=>({id,titulo:`Edición ${id}`,fechaCorte,geojsonId:`g${id}`,pdfId:null,dwgId:null});
describe('histórico público unificado',()=>{
  it('combina ambas fuentes en el mismo año, con los años más recientes primero',()=>{
    const result=agruparHistorial([edicion(1,'2025-02-12')],[{anio:2025,meses:[{id:1,mes:1,archivoId:'a',nombre:'enero.dwg'}]},{anio:2024,meses:[]}]);
    expect(result.map(g=>g.anio)).toEqual([2025]);
    expect(result[0].registros.map(r=>r.id)).toEqual(['edicion-1','anterior-1']);
  });
  it('preserva dos ediciones publicadas en una misma fecha y mes',()=>{
    const result=agruparHistorial([edicion(1,'2026-11-12'),edicion(2,'2026-11-12')],[]);
    expect(result[0].registros).toHaveLength(2);
    expect(result[0].registros.map(r=>r.id)).toEqual(['edicion-2','edicion-1']);
  });
  it('identifica la última publicación aunque su fecha de corte sea anterior',()=>{
    const result=agruparHistorial([edicion(2,'2024-01-01'),edicion(1,'2025-01-01')],[]);
    expect(result.map(g=>g.anio)).toEqual([2025,2024]);
    expect(result.flatMap(g=>g.registros).filter(r=>r.enVisor).map(r=>r.id)).toEqual(['edicion-2']);
  });
  it('no crea descargas PDF o DWG si esa edición no las tiene',()=>{
    expect(agruparHistorial([edicion(1,'2026-01-01')],[])[0].registros[0].archivos.map(a=>a.formato)).toEqual(['GEOJSON']);
  });
  it('conserva el nombre real y codifica espacios en una descarga anterior',()=>{
    const result=agruparHistorial([],[{anio:2024,meses:[{id:1,mes:9,archivoId:'a',nombre:'catastro septiembre.dwg'}]}]);
    expect(result[0].registros[0].archivos[0].url).toBe('/archivos/a/catastro%20septiembre.dwg');
    expect(result[0].registros[0].fechaVisible).toBe('septiembre');
  });
  it('no inventa registros cuando las dos fuentes están vacías',()=>expect(agruparHistorial([],[])).toEqual([]));
});
