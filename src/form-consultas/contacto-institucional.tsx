import { Button, Card, CardBody, CardHeader, Chip, Divider, addToast } from '@heroui/react';
import { Building2, Clipboard, Clock, Mail, Send } from 'lucide-react';

export function ContactoInstitucional() {
  const email = 'simlar@emse.ar'; 

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      addToast({
        title: 'Email copiado',
        description: `El email se copió al portapapeles`,
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
            <p className="text-2xl font-bold">Contacto institucional</p>
            <p className="text-default-500">Canal oficial para consultas y notas.</p>
          </div>
        </div>

        <Chip color="primary" variant="flat">
          Oficial
        </Chip>
      </CardHeader>

      <Divider />

      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-default-50 border border-default-200">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <p className="font-semibold">Email</p>
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
              Enviar
            </Button>
            <Button variant="flat" startContent={<Clipboard className="w-4 h-4" />} onPress={copy}>
              Copiar
            </Button>
          </div>

          <p className="mt-3 text-sm text-default-500">Tiempo estimado de respuesta: 24–48 h hábiles.</p>
        </div>

        <div className="rounded-2xl p-4 bg-default-50 border border-default-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <p className="font-semibold">Horario de atención</p>
          </div>

          <p className="mt-2 text-default-700">Lunes a viernes - 09:00 a 13:00 y 18:00 a 21:00</p>

          <p className="mt-3 text-sm text-default-500">
            Para consultas técnicas sobre proyectos, podes escribirnos a través del formulario de consultas o al email
            institucional.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
