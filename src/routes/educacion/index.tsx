import { Link, createFileRoute } from '@tanstack/react-router';
import { BookOpen, Construction, ExternalLink, GraduationCap, Mail } from 'lucide-react';
import { Alert, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { useTranslation } from 'react-i18next';
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
    titulo: 'routes.educacion.oferta.carreras.ingenieriaMinas.titulo',
    institucion: 'routes.educacion.oferta.carreras.ingenieriaMinas.institucion',
    descripcion:
      'routes.educacion.oferta.carreras.ingenieriaMinas.descripcion',
    correo: 'dmina@unlar.edu.ar',
    planEstudio: {
      texto: 'routes.educacion.oferta.verPlan',
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
    titulo: 'routes.educacion.oferta.carreras.geologia.titulo',
    institucion: 'routes.educacion.oferta.carreras.geologia.institucion',
    descripcion:
      'routes.educacion.oferta.carreras.geologia.descripcion',
    correo: 'dgeologia@unlar.edu.ar',
    planEstudio: {
      texto: 'routes.educacion.oferta.verPlan',
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
    titulo: 'routes.educacion.oferta.carreras.tecnicaturaMinas.titulo',
    institucion: 'routes.educacion.oferta.carreras.tecnicaturaMinas.institucion',
    descripcion:
      'routes.educacion.oferta.carreras.tecnicaturaMinas.descripcion',
    planEstudio: {
      texto: 'routes.educacion.oferta.verPlan',
      url: 'https://isfdytguandacol-lrj.infd.edu.ar/sitio/plan-de-estudios-3/',
    },
    contactos: [
      {
        cargo: 'routes.educacion.oferta.contactos.instituto',
        correo: 'instguandacol@gmail.com',
      },
      {
        cargo: 'routes.educacion.oferta.contactos.directora',
        correo: 'adrianagnzlz93@gmail.com',
      },
      {
        cargo: 'routes.educacion.oferta.contactos.coordinadora',
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
  const { t } = useTranslation();
  return (
    <div className="mt-4 space-y-10">
      <SectionTitle title={t('routes.educacion.page.title')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link to="/educacion/informativa">
          <Card className="py-4 h-full transition duration-200 ease-in-out hover:scale-102 cursor-pointer">
            <CardHeader>
              <p className="text-2xl font-bold">{t('routes.educacion.secciones.informativaTitulo')}</p>
            </CardHeader>
            <CardBody>{t('routes.educacion.secciones.informativaDescripcion')}</CardBody>
          </Card>
        </Link>

        {/* <Link to="/educacion/dinamica"> */}
        <Card className="py-4 h-full transition duration-200 ease-in-out hover:scale-102 cursor-pointer">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-2xl font-bold">{t('routes.educacion.secciones.dinamicaTitulo')}</p>
          </CardHeader>
          <CardBody>{t('routes.educacion.secciones.dinamicaDescripcion')}</CardBody>
          <CardFooter>
            <Alert icon={<Construction />} color="warning">
              {t('routes.educacion.secciones.enConstruccion')}
            </Alert>
          </CardFooter>
        </Card>
        {/* </Link> */}
      </div>

      <section className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t('routes.educacion.oferta.title')}</h2>
          <p className="text-default-600 max-w-3xl mx-auto">
            {t('routes.educacion.oferta.descripcion')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ofertaAcademica.map((carrera) => (
            <Card key={carrera.titulo} className="py-4 h-full transition duration-200 ease-in-out hover:scale-102">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-primary" size={24} />
                  <p className="text-2xl font-bold">{t(carrera.titulo)}</p>
                </div>
                <p className="text-sm text-default-500">{t(carrera.institucion)}</p>
              </CardHeader>

              <CardBody className="space-y-4">
                <p className="text-default-600">{t(carrera.descripcion)}</p>

                <div className="space-y-2">
                  {carrera.planEstudio && (
                    <a
                      href={carrera.planEstudio.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition"
                    >
                      <BookOpen size={18} />
                      {t(carrera.planEstudio.texto)}
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
                        <strong>{t(contacto.cargo)}:</strong> {contacto.correo}
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
