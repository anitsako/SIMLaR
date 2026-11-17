import { ChevronDown, Download } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useCatastroHistorico } from './use-catastro-historico';
import { useEdicionesCatastro } from '@/catastro-minero/use-ediciones';
import { useTranslation } from 'react-i18next';
import { agruparHistorial } from './agrupar-historial';

const MESES = [
  'common.meses.enero', 'common.meses.febrero', 'common.meses.marzo', 'common.meses.abril',
  'common.meses.mayo', 'common.meses.junio', 'common.meses.julio', 'common.meses.agosto',
  'common.meses.septiembre', 'common.meses.octubre', 'common.meses.noviembre', 'common.meses.diciembre',
] as const;

export function HistorialCatastro({ puedeAdministrar = false }: { puedeAdministrar?: boolean }) {
  const ediciones = useEdicionesCatastro();
  const anteriores = useCatastroHistorico();
  const { t } = useTranslation();
  const grupos = agruparHistorial(ediciones.data ?? [], anteriores.data ?? [], {
    meses: MESES.map((mes) => t(mes)),
    fechaConDia: (dia, mes) => t('routes.catastro.historico.fechaConDia', { dia, mes }),
    mesDesconocido: (mes) => t('routes.catastro.historico.mesDesconocido', { mes }),
    archivoCatastral: t('routes.catastro.historico.archivoCatastral'),
    archivo: t('routes.catastro.historico.archivo'),
  });
  return <div className="space-y-6">
    {(ediciones.isPending || anteriores.isPending) && <p role="status" className="text-sm text-default-500">{t('routes.catastro.historico.cargandoRegistros')}</p>}
    {ediciones.isError && <p role="alert" className="text-sm text-danger">{t('routes.catastro.historico.errorEdiciones')}</p>}
    {anteriores.isError && <p role="alert" className="text-sm text-danger">{t('routes.catastro.historico.errorAnteriores')}</p>}
    {!grupos.length && !ediciones.isPending && !anteriores.isPending && !ediciones.isError && !anteriores.isError &&
      <p className="text-default-500">{t('routes.catastro.historico.sinRegistros')}</p>}

    <div className="mx-auto w-full max-w-4xl">
      {grupos.map(({ anio, registros }, index) => <details key={anio} open={index === 0} className="group border-l border-default-300 pb-5">
        <summary className="relative ml-6 flex cursor-pointer list-none items-center justify-between gap-3 py-3 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="absolute -left-7.5 h-3 w-3 rounded-full bg-danger ring-4 ring-background" />
          <span className="text-3xl font-semibold text-default-600">{anio}</span>
          <ChevronDown size={18} aria-hidden="true" className="mr-2 text-default-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="ml-6 divide-y divide-default-200">
          {registros.map(registro => <div key={registro.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium capitalize text-default-700">{registro.fechaVisible}</span>
                {registro.enVisor && <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">{t('routes.catastro.historico.enVisor')}</span>}
              </div>
              <p className="mt-1 break-words text-sm text-default-500">{registro.titulo}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {registro.archivos.map(a => <a key={a.url} href={a.url} target="_blank" rel="noreferrer"
                aria-label={t('routes.catastro.historico.descargarAria', { formato: a.formato, fecha: registro.fechaVisible, anio, titulo: registro.titulo })}
                className="inline-flex items-center gap-1.5 rounded-md border border-default-300 px-3 py-1.5 text-sm text-default-600 transition hover:border-danger hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger">
                <Download size={15} aria-hidden="true" />{a.formato}
              </a>)}
            </div>
          </div>)}
        </div>
      </details>)}
    </div>



    {puedeAdministrar && <div className="flex justify-end"><Link to="/catastro-historico/administrar" className="text-sm text-primary underline">{t('routes.catastro.historico.administrarAnteriores')}</Link></div>}
  </div>;
}
