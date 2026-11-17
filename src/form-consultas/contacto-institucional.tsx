import { Button, Card, CardBody, CardHeader, Chip, Divider, addToast } from '@heroui/react';
import { Building2, Clipboard, Clock, Mail, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ContactoInstitucional() {
  const { t } = useTranslation();
  const email = 'simlar@emse.ar'; 

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      addToast({
        title: t('routes.contacto.contactoInstitucional.copiadoTitulo'),
        description: t('routes.contacto.contactoInstitucional.copiadoDescripcion'),
        color: 'success',
        variant: 'solid',
      });
    } catch (err) {
      console.error('Error al copiar el email:', err);
    }
  };

  return (
    <Card className="max-w-6xl w-full">
      <CardHeader className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl p-3 bg-default-100">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{t('routes.contacto.contactoInstitucional.title')}</p>
            <p className="text-default-500">{t('routes.contacto.contactoInstitucional.cardDescripcion')}</p>
          </div>
        </div>

        <Chip color="primary" variant="flat">
          {t('routes.contacto.contactoInstitucional.oficial')}
        </Chip>
      </CardHeader>

      <Divider />

      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-default-50 border border-default-200">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <p className="font-semibold">{t('routes.contacto.contactoInstitucional.email')}</p>
          </div>

          <a href={`mailto:${email}`} className="block mt-2 text-lg font-medium text-primary">
            {email}
          </a>

          <div className="flex gap-2 mt-4">
            <Button
              color="primary"
              variant="solid"
              startContent={<Send className="w-4 h-4" />}
              as="a"
              href={`mailto:${email}`}
            >
              {t('common.acciones.enviar')}
            </Button>
            <Button variant="flat" startContent={<Clipboard className="w-4 h-4" />} onPress={copy}>
              {t('common.acciones.copiar')}
            </Button>
          </div>

          <p className="mt-3 text-sm text-default-500">{t('routes.contacto.contactoInstitucional.tiempoRespuesta')}</p>
        </div>

        <div className="rounded-2xl p-4 bg-default-50 border border-default-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <p className="font-semibold">{t('routes.contacto.contactoInstitucional.horarioTitulo')}</p>
          </div>

          <p className="mt-2 text-default-700">{t('routes.contacto.contactoInstitucional.horario')}</p>

          <p className="mt-3 text-sm text-default-500">
            {t('routes.contacto.contactoInstitucional.consultasTecnicas')}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
