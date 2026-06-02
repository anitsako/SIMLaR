import { Link, createFileRoute } from '@tanstack/react-router';
import { BookOpen, Construction, ExternalLink, GraduationCap, Mail } from 'lucide-react';
import { Alert, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/educacion/')({
  component: RouteComponent,
});

type Contacto = {
  cargo: string;
  correo: string;
};

type Enlace = {
  texto: string;
  url: string;
};

type OfertaAcademica = {
  titulo: string;
  institucion: string;
  descripcion: string;
  correo?: string;
  planEstudio?: Enlace;
  contactos?: Array<Contacto>;
  redes?: Array<Enlace>;
};

const ofertaAcademica: Array<OfertaAcademica> = [
  {
    titulo: 'Ingeniería en Minas',
    institucion: 'Universidad Nacional de La Rioja',
    descripcion:
      'Carrera orientada a la formación de profesionales especializados en exploración, explotación, planificación y gestión de recursos mineros.',
    correo: 'dmina@unlar.edu.ar',
    planEstudio: {
      texto: 'Ver plan de estudio',
      url: 'https://www.unlar.edu.ar/index.php/oferta-academica/carreras-de-grado/325-ingenieria-en-minas',
    },
    redes: [
      {
        texto: 'Facebook: IdeM - ingenieriademinasunlar',
        url: 'https://www.facebook.com/ingenieriademinasunlar',
      },
      {
        texto: 'Instagram: ingenieria.deminas',
        url: 'https://www.instagram.com/ingenieria.deminas',
      },
    ],
  },
  {
    titulo: 'Geología',
    institucion: 'Universidad Nacional de La Rioja',
    descripcion:
      'Formación vinculada al estudio de la Tierra, los recursos geológicos, la prospección, exploración y evaluación del potencial minero.',
    correo: 'dgeologia@unlar.edu.ar',
    planEstudio: {
      texto: 'Ver plan de estudio',
      url: 'https://www.unlar.edu.ar/index.php/oferta-academica/carreras-de-grado/320-geologia',
    },
    redes: [
      {
        texto: 'Facebook: Geología UNLaR',
        url: 'https://www.facebook.com/share/1CQnvoVAk2/',
      },
    ],
  },
  {
    titulo: 'Tecnicatura Superior en Minas',
    institucion: 'Instituto Superior de Formación Docente y Técnica de Guandacol',
    descripcion:
      'Propuesta técnica orientada a fortalecer capacidades operativas y profesionales relacionadas con la actividad minera provincial.',
    planEstudio: {
      texto: 'Ver plan de estudio',
      url: 'https://isfdytguandacol-lrj.infd.edu.ar/sitio/plan-de-estudios-3/',
    },
    contactos: [
      {
        cargo: 'Instituto',
        correo: 'instguandacol@gmail.com',
      },
      {
        cargo: 'Directora',
        correo: 'adrianagnzlz93@gmail.com',
      },
      {
        cargo: 'Coordinadora de Carrera',
        correo: 'patobsoledo@hotmail.com',
      },
    ],
    redes: [
      {
        texto: 'Facebook: Tecnicatura',
        url: 'https://www.facebook.com/profile.php?id=100009213700460',
      },
    ],
  },
];

function RouteComponent() {
  return (
    <div className="mt-4 space-y-10">
      <SectionTitle title="Educación minera" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link to="/educacion/informativa">
          <Card className="py-4 h-full transition duration-200 ease-in-out hover:scale-102 cursor-pointer">
            <CardHeader>
              <p className="text-2xl font-bold">Sección Informativa</p>
            </CardHeader>
            <CardBody>Aquí se encuentra el contenido informativo sobre minería.</CardBody>
          </Card>
        </Link>

        {/* <Link to="/educacion/dinamica"> */}
        <Card className="py-4 h-full transition duration-200 ease-in-out hover:scale-102 cursor-pointer">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-2xl font-bold">Sección Dinámica</p>
          </CardHeader>
          <CardBody>Aquí se encuentra el contenido dinámico sobre minería, con actividades interactivas.</CardBody>
          <CardFooter>
            <Alert icon={<Construction />} color="warning">
              En construcción
            </Alert>
          </CardFooter>
        </Card>
        {/* </Link> */}
      </div>

      <section className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Oferta académica minera en La Rioja</h2>
          <p className="text-default-600 max-w-3xl mx-auto">
            La provincia cuenta con propuestas de formación universitaria y técnica vinculadas al desarrollo minero,
            fortaleciendo la capacitación de profesionales y recursos humanos especializados para el sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ofertaAcademica.map((carrera) => (
            <Card key={carrera.titulo} className="py-4 h-full transition duration-200 ease-in-out hover:scale-102">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-primary" size={24} />
                  <p className="text-2xl font-bold">{carrera.titulo}</p>
                </div>
                <p className="text-sm text-default-500">{carrera.institucion}</p>
              </CardHeader>

              <CardBody className="space-y-4">
                <p className="text-default-600">{carrera.descripcion}</p>

                <div className="space-y-2">
                  {carrera.planEstudio && (
                    <a
                      href={carrera.planEstudio.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition"
                    >
                      <BookOpen size={18} />
                      {carrera.planEstudio.texto}
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {carrera.correo && (
                    <a
                      href={`mailto:${carrera.correo}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition"
                    >
                      <Mail size={18} />
                      {carrera.correo}
                    </a>
                  )}

                  {carrera.contactos?.map((contacto) => (
                    <a
                      key={contacto.correo}
                      href={`mailto:${contacto.correo}`}
                      className="flex items-center gap-2 text-sm hover:text-primary transition"
                    >
                      <Mail size={18} />
                      <span>
                        <strong>{contacto.cargo}:</strong> {contacto.correo}
                      </span>
                    </a>
                  ))}

                  {carrera.redes?.map((red) => (
                    <a
                      key={red.url}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition"
                    >
                      <ExternalLink size={18} />
                      {red.texto}
                    </a>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
