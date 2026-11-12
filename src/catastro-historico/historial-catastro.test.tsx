import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
vi.mock('./use-catastro-historico',()=>({useCatastroHistorico:()=>({data:[{anio:2024,meses:[{id:1,mes:9,archivoId:'viejo',nombre:'catastro.dwg'}]}],isPending:false,isError:false})}));
vi.mock('@/catastro-minero/use-ediciones',()=>({useEdicionesCatastro:()=>({data:[{id:1,titulo:'Edición de prueba',fechaCorte:'2026-11-12',geojsonId:'geo',pdfId:'pdf',dwgId:null,observaciones:'Nota reservada al panel'}],isPending:false,isError:false})}));
import { HistorialCatastro } from './historial-catastro';
it('muestra un solo histórico anual, conserva descargas y deja las observaciones fuera del listado público',()=>{
  const html=renderToStaticMarkup(createElement(HistorialCatastro));
  expect(html).toContain('2026');expect(html).toContain('2024');
  expect(html).toContain('12 de noviembre');expect(html).toContain('septiembre');
  expect(html).toContain('/archivos/viejo/catastro.dwg');
  expect(html).toContain('/archivos/geo/catastro-2026-11-12.geojson');
  expect(html).toContain('En el visor');
  expect(html).not.toContain('Ediciones publicadas');
  expect(html).not.toContain('Archivos históricos anteriores');
  expect(html).not.toContain('Nota reservada al panel');
  expect(html).not.toContain('Archivos recibidos sin fecha de corte confirmada');
});
