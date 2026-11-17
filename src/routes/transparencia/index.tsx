import { Card, CardBody, CardHeader } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { ExternalLink, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/transparencia/')({
  component: RouteComponent,
});

const documentosNormativos = [
  {
    titulo: 'routes.transparencia.normas.constitucionNacional.titulo',
    descripcion: 'routes.transparencia.normas.constitucionNacional.descripcion',
    url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/804/norma.htm',
  },
  {
    titulo: 'routes.transparencia.normas.constitucionProvincial.titulo',
    descripcion: 'routes.transparencia.normas.constitucionProvincial.descripcion',
    url: 'https://www.saij.gob.ar/0-local-rioja-constitucion-provincia-rioja-lpf1000000-2008-05-14/123456789-0abc-defg-000-0001fvorpyel',
  },
  {
    titulo: 'routes.transparencia.normas.codigoMineria.titulo',
    descripcion: 'routes.transparencia.normas.codigoMineria.descripcion',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-1919-43797/actualizacion',
  },
  {
    titulo: 'routes.transparencia.normas.codigoProcedimientos.titulo',
    descripcion: 'routes.transparencia.normas.codigoProcedimientos.descripcion',
    url: 'https://www.argentina.gob.ar/normativa/provincial/ley-7277-123456789-0abc-defg-772-7000fvorpyel/actualizacion',
  },
  {
    titulo: 'routes.transparencia.normas.inversionesMineras.titulo',
    descripcion: 'routes.transparencia.normas.inversionesMineras.descripcion',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24196-594/actualizacion',
  },
  {
    titulo: 'routes.transparencia.normas.proteccionAmbiental.titulo',
    descripcion: 'routes.transparencia.normas.proteccionAmbiental.descripcion',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24585-30096/texto',
  },
  {
    titulo: 'routes.transparencia.normas.proveedoresMineros.titulo',
    descripcion: 'routes.transparencia.normas.proveedoresMineros.descripcion',
    url: 'https://proveedoresmineros.larioja.gob.ar/wp-content/uploads/2025/07/Ley_10799_2025-06-27_para_el_desarrollo_de_proveedores_mineros_y_mano_de_obra_riojana.pdf',
  }
];

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div className="mt-4 w-full max-w-6xl space-y-8">
      <SectionTitle title={t('routes.transparencia.page.title')} />

      <p className="text-default-600">
        {t('routes.transparencia.page.description')}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {documentosNormativos.map((documento) => (
          <Card
            key={documento.titulo}
            className="h-full transition duration-200 ease-in-out hover:scale-[1.02]"
          >
            <CardHeader className="flex items-start gap-3">
              <div className="rounded-lg bg-danger/10 p-3 text-danger">
                <FileText size={26} />
              </div>

              <div>
                <p className="text-xl font-bold">{t(documento.titulo)}</p>
                <p className="text-sm text-default-500">
                  {t('routes.transparencia.enlaceOficial')}
                </p>
              </div>
            </CardHeader>

            <CardBody className="space-y-4">
              <p className="text-default-600">{t(documento.descripcion)}</p>

              <a
                href={documento.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t('routes.transparencia.verNormativa')}
                <ExternalLink size={16} />
              </a>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
