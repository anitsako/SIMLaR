import { lazy, Suspense, useEffect, useState } from 'react';
import { ClientOnly, Link, createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';
import i18n from '@/i18n';
import { publicarEdicionCatastroFn } from '@/catastro-minero/ediciones.fn';
import { MAX_ARCHIVO, validarFecha, validarGeojson } from '@/catastro-minero/validar-edicion';
import { EDICIONES_QUERY } from '@/catastro-minero/use-ediciones';
import { EdicionesPublicadas } from '@/catastro-historico/ediciones-publicadas';

const Preview = lazy(()=>import('@/catastro-minero/CatastroViewer').then(m=>({default:m.CatastroViewer})));

export const Route = createFileRoute('/_authed/catastro/administrar/')({
  beforeLoad:({context})=>{if(!context.usuario?.esAdmin)throw new Error(i18n.t('common.errores.requiereAdmin'));},
  component:AdministrarCatastro,
});

async function encode(file: File) {
  if(!file.size||file.size>MAX_ARCHIVO)throw new Error(i18n.t('routes.admin.catastro.mensajes.pesoArchivo'));
  return new Promise<{base64:string}>((resolve,reject)=>{
    const reader=new FileReader();reader.onload=()=>resolve({base64:String(reader.result).split(',')[1]});
    reader.onerror=()=>reject(new Error(i18n.t('routes.admin.catastro.mensajes.noSePudoLeer', { nombre: file.name })));reader.readAsDataURL(file);
  });
}

function AdministrarCatastro(){
  const { t } = useTranslation();
  const qc=useQueryClient();
  const [titulo,setTitulo]=useState('');const [fecha,setFecha]=useState('');const [notas,setNotas]=useState('');
  const [geo,setGeo]=useState<File>();const [pdf,setPdf]=useState<File>();const [dwg,setDwg]=useState<File>();
  const [preview,setPreview]=useState<number>();const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  const [previewUrl,setPreviewUrl]=useState<string>();
  useEffect(()=>()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);},[previewUrl]);
  const [success,setSuccess]=useState(false);const [formKey,setFormKey]=useState(0);
  function changed(){setPreview(undefined);setPreviewUrl(undefined);setMessage('');setSuccess(false);}
  async function revisar(){
    setBusy(true);setMessage('');setSuccess(false);
    try{validarFecha(fecha);if(titulo.trim().length<3)throw new Error(t('routes.admin.catastro.mensajes.tituloCorto'));
      if(!geo)throw new Error(t('routes.admin.catastro.mensajes.sinGeojson'));
      if([geo,pdf,dwg].some(f=>f&&(!f.size||f.size>MAX_ARCHIVO)))throw new Error(t('routes.admin.catastro.mensajes.limiteArchivo'));
      const count=validarGeojson(JSON.parse(await geo.text()));setPreview(count);setPreviewUrl(URL.createObjectURL(geo));
    }catch(e){setMessage(e instanceof Error?e.message:t('routes.admin.catastro.mensajes.errorRevisar'));}finally{setBusy(false);}
  }
  async function publicar(){
    if(!preview||!geo||busy)return;
    setBusy(true);setMessage('');setSuccess(false);
    try{
      await publicarEdicionCatastroFn({data:{titulo,fechaCorte:fecha,observaciones:notas,geojson:await encode(geo),pdf:pdf?await encode(pdf):undefined,dwg:dwg?await encode(dwg):undefined}});
      setPreview(undefined);setPreviewUrl(undefined);setGeo(undefined);setPdf(undefined);setDwg(undefined);setTitulo('');setFecha('');setNotas('');setFormKey(k=>k+1);
      await qc.invalidateQueries({queryKey:EDICIONES_QUERY});
      setSuccess(true);setMessage(t('routes.admin.catastro.mensajes.exito'));
    }catch(e){setMessage(e instanceof Error?e.message:t('routes.admin.catastro.mensajes.errorPublicar'));}finally{setBusy(false);}
  }
  const input='mt-1 w-full rounded-lg border border-default-300 bg-background p-3';
  return <div className="mt-4 space-y-6 pb-8">
    <SectionTitle title={t('routes.admin.catastro.page.title')} subtitle={t('routes.admin.catastro.page.subtitle')}/>
    <Link to="/catastro" className="text-primary underline">{t('routes.admin.catastro.page.volver')}</Link>
    <form key={formKey} onSubmit={e=>{e.preventDefault();void revisar();}} className="space-y-4 rounded-xl border p-5">
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
        <label className="block">{t('routes.admin.catastro.form.titulo')}<input required minLength={3} maxLength={120} className={input} value={titulo} onChange={e=>{setTitulo(e.target.value);changed();}}/></label>
        <label className="block">{t('routes.admin.catastro.form.fecha')}<input required type="date" className={input} value={fecha} onChange={e=>{setFecha(e.target.value);changed();}}/></label>
        <label className="block">{t('routes.admin.catastro.form.geojson')}<input required type="file" accept=".geojson,.json" className={input} onChange={e=>{setGeo(e.target.files?.[0]);changed();}}/></label>
        <label className="block">{t('routes.admin.catastro.form.pdf')}<input type="file" accept=".pdf" className={input} onChange={e=>{setPdf(e.target.files?.[0]);changed();}}/></label>
        <label className="block">{t('routes.admin.catastro.form.dwg')}<input type="file" accept=".dwg" className={input} onChange={e=>{setDwg(e.target.files?.[0]);changed();}}/></label>
        <p className="text-sm text-default-600">{t('routes.admin.catastro.form.limite')}</p>
        <label className="block">{t('routes.admin.catastro.form.observaciones')}<textarea maxLength={2000} className={input} value={notas} onChange={e=>{setNotas(e.target.value);changed();}}/></label>
        <button className="rounded-lg border px-4 py-2" type="submit">{busy?t('routes.admin.catastro.form.procesando'):t('routes.admin.catastro.form.revisar')}</button>
      </fieldset>
      {preview!==undefined&&<div className="space-y-3 rounded-lg border border-warning-300 p-4">
        <p><Trans i18nKey="routes.admin.catastro.preview.resumen" values={{ titulo, fecha, cantidad: preview.toLocaleString('es-AR') }} components={{ b: <strong /> }} /></p>
        <p className="text-sm">{t('routes.admin.catastro.preview.aviso')}</p>
        {previewUrl&&<ClientOnly><Suspense fallback={<p>{t('routes.admin.catastro.preview.cargando')}</p>}><Preview geojsonUrls={[previewUrl]} title={t('routes.admin.catastro.preview.visorTitle')}/></Suspense></ClientOnly>}
        <button disabled={busy} type="button" onClick={()=>void publicar()} className="rounded-lg bg-danger px-4 py-2 text-white disabled:opacity-50">{busy?t('routes.admin.catastro.preview.publicando'):t('routes.admin.catastro.preview.publicar')}</button>
      </div>}
      {message&&<p role={success?'status':'alert'} className={success?'text-success-700':'text-danger'}>{message}</p>}
    </form>
    <EdicionesPublicadas/>
  </div>;
}
