import { ClientOnly, Link, createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';
import i18n from '@/i18n';
import { CatastroMineroSeccion } from '@/catastro-minero/catastro-minero.seccion';
import { HistorialCatastro } from '@/catastro-historico/historial-catastro';

export const Route = createFileRoute('/catastro/')({
  component: CatastroPage,
  head: () => ({
    meta: [
      { title: i18n.t('routes.catastro.meta.title') },
      { name: 'description', content: i18n.t('routes.catastro.meta.description') },
    ],
  }),
});

const rootRoute=getRouteApi('__root__');

function CatastroPage() {
  const {usuario}=rootRoute.useRouteContext();
  const { t } = useTranslation();
  return (
    <div className="mt-4 space-y-8 pb-8">
      <SectionTitle title={t('routes.catastro.page.title')} subtitle={t('routes.catastro.page.subtitle')} />

      {usuario?.esAdmin && <Link to="/catastro/administrar" className="inline-block rounded-lg bg-danger px-4 py-2 text-white">{t('routes.catastro.page.administrarEdiciones')}</Link>}

      <nav aria-label={t('routes.catastro.page.seccionesAria')} className="flex flex-wrap gap-3">
        <a href="#catastro-minero" className="rounded-lg border px-4 py-2 text-primary hover:bg-default-100">{t('routes.catastro.minero.title')}</a>
        <a href="#catastro-historico" className="rounded-lg border px-4 py-2 text-primary hover:bg-default-100">{t('routes.catastro.historico.title')}</a>
      </nav>

      <section id="catastro-minero" aria-label={t('routes.catastro.minero.title')} className="scroll-mt-28">
        <ClientOnly fallback={<p role="status">{t('routes.catastro.minero.cargando')}</p>}><CatastroMineroSeccion /></ClientOnly>
      </section>

      <section id="catastro-historico" aria-labelledby="historico-titulo" className="scroll-mt-28 space-y-5 border-t pt-8">
        <header>
          <h2 id="historico-titulo" className="text-2xl font-semibold">{t('routes.catastro.historico.title')}</h2>
          <p className="mt-2 text-default-600">{t('routes.catastro.historico.subtitle')}</p>
        </header>
        <ClientOnly fallback={<p role="status">{t('routes.catastro.historico.cargando')}</p>}>
          <HistorialCatastro puedeAdministrar={Boolean(usuario?.esAdmin)}/>
        </ClientOnly>
      </section>
    </div>
  );
}
