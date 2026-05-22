import { Alert, Card, CardBody, CardHeader } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Construction, ExternalLink, FileText } from 'lucide-react';
import SectionTitle from '@/common/sectionTitle';

export const Route = createFileRoute('/transparencia/')({
  component: RouteComponent,
});

const documentosNormativos = [
  {
    titulo: 'Código de Procedimientos Mineros',
    descripcion:
      'Ley Nº 7277. Norma provincial que regula el procedimiento de las actividades mineras en la Provincia de La Rioja.',
    archivo: '/documentos/codigo-procedimientos-mineros.pdf',
  },
  {
    titulo: 'Código de Minería',
    descripcion:
      'Ley Nº 1919. Código nacional que regula los derechos, obligaciones y procedimientos vinculados a la actividad minera en Argentina.',
    archivo: '/documentos/codigo-mineria.pdf',
  },
];

function RouteComponent() {
  return (
    <div className="mt-4 w-full max-w-6xl space-y-8">
      <SectionTitle title="Transparencia" sizeTitle="5xl" textCenter />


      <section className="space-y-4">
        <SectionTitle title="Marco normativo" sizeTitle="3xl" />

        <p className="text-default-600">
          En esta sección se ponen a disposición documentos normativos vinculados
          a la actividad minera, el procedimiento administrativo minero y el marco
          legal aplicable.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {documentosNormativos.map((documento) => (
            <Card
              key={documento.titulo}
              className="h-full transition duration-200 ease-in-out hover:scale-102"
            >
              <CardHeader className="flex items-start gap-3">
                <div className="rounded-lg bg-danger/10 p-3 text-danger">
                  <FileText size={26} />
                </div>

                <div>
                  <p className="text-xl font-bold">{documento.titulo}</p>
                  <p className="text-sm text-default-500">
                    Documento disponible en formato PDF
                  </p>
                </div>
              </CardHeader>

              <CardBody className="space-y-4">
                <p className="text-default-600">{documento.descripcion}</p>

                <a
                  href={documento.archivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Ver documento
                  <ExternalLink size={16} />
                </a>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}