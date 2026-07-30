import { Card, CardBody, CardHeader } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { ExternalLink, FileText } from 'lucide-react';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/transparencia/')({
  component: RouteComponent,
});

const documentosNormativos = [
    {
    titulo: 'Ley Nº 1919 - Código de Minería',
    descripcion:
      'Código nacional que regula los derechos, obligaciones y procedimientos vinculados a la actividad minera en Argentina.',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-1919-43797/actualizacion',
  },
  {
    titulo: 'Ley Nº 7277 - Código de Procedimientos Mineros',
    descripcion:
      'Norma provincial que regula el procedimiento de las actividades mineras en la Provincia de La Rioja.',
    url: 'https://www.argentina.gob.ar/normativa/provincial/ley-7277-123456789-0abc-defg-772-7000fvorpyel/actualizacion',
  },
  {
    titulo: 'Ley Nº 24.196 - Inversiones Mineras',
    descripcion:
      'Régimen nacional de inversiones para la actividad minera en Argentina.',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24196-594/actualizacion',
  },
  {
    titulo: 'Ley Nº 24.585 - Protección Ambiental Minera',
    descripcion:
      'Normativa nacional vinculada a la protección ambiental para la actividad minera.',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24585-30096/texto',
  },
];

function RouteComponent() {
  return (
    <div className="mt-4 w-full max-w-6xl space-y-8">
      <SectionTitle title="Marco normativo" />

      <p className="text-default-600">
          En esta sección se ponen a disposición enlaces oficiales a normativa vinculada a la actividad minera,
          el procedimiento administrativo minero, la protección ambiental y el marco legal aplicable.
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
                  <p className="text-xl font-bold">{documento.titulo}</p>
                  <p className="text-sm text-default-500">
                    Enlace oficial disponible en argentina.gob.ar
                  </p>
                </div>
              </CardHeader>

              <CardBody className="space-y-4">
                <p className="text-default-600">{documento.descripcion}</p>

                <a
                  href={documento.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Ver normativa
                  <ExternalLink size={16} />
                </a>
              </CardBody>
            </Card>
          ))}
        </div>
    </div>
  );
}