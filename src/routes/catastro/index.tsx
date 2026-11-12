import { ClientOnly, Link, createFileRoute, getRouteApi } from '@tanstack/react-router';
import SectionTitle from '@/common/section-title';
import { CatastroMineroSeccion } from '@/catastro-minero/catastro-minero.seccion';
import { HistorialCatastro } from '@/catastro-historico/historial-catastro';

export const Route = createFileRoute('/catastro/')({
  component: CatastroPage,
  head: () => ({
    meta: [
      { title: 'Catastro | SIMLaR' },
      { name: 'description', content: 'Catastro minero de La Rioja: visor de parcelas, descargas y archivos históricos por año y mes.' },
    ],
  }),
});

const rootRoute=getRouteApi('__root__');

function CatastroPage() {
  const {usuario}=rootRoute.useRouteContext();
  return (
    <div className="mt-4 space-y-8 pb-8">
      <SectionTitle title="Catastro" subtitle="Visor minero y archivos históricos de La Rioja" />

      {usuario?.esAdmin && <Link to="/catastro/administrar" className="inline-block rounded-lg bg-danger px-4 py-2 text-white">Administrar ediciones del catastro</Link>}

      <nav aria-label="Secciones de Catastro" className="flex flex-wrap gap-3">
        <a href="#catastro-minero" className="rounded-lg border px-4 py-2 text-primary hover:bg-default-100">Catastro Minero</a>
        <a href="#catastro-historico" className="rounded-lg border px-4 py-2 text-primary hover:bg-default-100">Catastro Histórico</a>
      </nav>

      <section id="catastro-minero" aria-label="Catastro Minero" className="scroll-mt-28">
        <ClientOnly fallback={<p role="status">Cargando catastro…</p>}><CatastroMineroSeccion /></ClientOnly>
      </section>

      <section id="catastro-historico" aria-labelledby="historico-titulo" className="scroll-mt-28 space-y-5 border-t pt-8">
        <header>
          <h2 id="historico-titulo" className="text-2xl font-semibold">Catastro Histórico</h2>
          <p className="mt-2 text-default-600">Consultá y descargá los registros organizados por año y mes.</p>
        </header>
        <ClientOnly fallback={<p role="status">Cargando catastro histórico…</p>}>
          <HistorialCatastro puedeAdministrar={Boolean(usuario?.esAdmin)}/>
        </ClientOnly>
      </section>
    </div>
  );
}
