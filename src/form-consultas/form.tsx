import { Button, Card, CardBody, Form, Input, Textarea, addToast } from '@heroui/react';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useTranslation } from 'react-i18next';
import { sendEmailFn } from './send-email.fn';
// import Lottie from 'lottie-react';
// import HandShake from '../assets/lotties/Handshake Loop.json';

export default function Formulario() {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = useServerFn(sendEmailFn);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSending) return; // evita envíos múltiples
    setIsSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get('email') ?? '').trim();
    const consulta = String(formData.get('consulta') ?? '').trim();

    // Validación básica (UX)
    // if (!email || !email.includes('@')) {
    //   alert('Ingresá un email válido');
    //   return;
    // }

    if (consulta.length < 50) {
      addToast({
        title: t('routes.contacto.formulario.cortaTitulo'),
        description: t('routes.contacto.formulario.cortaDescripcion'),
        color: 'warning',
        variant: 'solid',
      });
      setIsSending(false);
      return;
    }

    try {
      await sendEmail({
        data: { email, consulta },
      });

      addToast({
        title: t('routes.contacto.formulario.exitoTitulo'),
        description: t('routes.contacto.formulario.exitoDescripcion'),
        color: 'success',
        variant: 'solid',
      });
      form.reset(); // limpia los inputs
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      addToast({
        title: t('routes.contacto.formulario.errorTitulo'),
        description:
          error instanceof Error
            ? error.message
            : t('routes.contacto.formulario.errorDescripcion'),
        color: 'danger',
      });
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row gap-6 w-auto mb-10">
      <Card className="w-full flex flex-row md:w-1/2 bg-gray-50 shadow-lg">
        <CardBody className="space-y-2 flex flex-col items-center justify-center text-center p-6">
          <p className="text-2xl text-center text-slate-600 leading-relaxed">
            {t('routes.contacto.formulario.intro')}
          </p>
          {/* <Lottie animationData={HandShake} loop={true} className="w-48" /> */}
        </CardBody>
      </Card>
      <Form
        onSubmit={handleSubmit}
        className="w-[75%] flex flex-col gap-3 rounded-lg p-5 shadow-lg bg-gray-50 text-gray-800"
      >
        <Input
          isRequired
          label={t('routes.contacto.formulario.emailLabel')}
          labelPlacement="outside"
          type="email"
          name="email"
          placeholder={t('routes.contacto.formulario.emailPlaceholder')}
          classNames={{
            label: 'text-xl font-medium',
            input: '!text-slate-900 text-lg placeholder:text-slate-400',
            errorMessage: 'text-md',
          }}
        />
        <Textarea
          isRequired
          label={t('routes.contacto.formulario.consultaLabel')}
          labelPlacement="outside"
          name="consulta"
          placeholder={t('routes.contacto.formulario.consultaPlaceholder')}
          classNames={{
            label: 'text-xl font-medium',
            input: '!text-slate-900 text-lg placeholder:text-slate-400 min-h-[250px] max-h-[250px]',
            errorMessage: 'text-md',
          }}
        />
        <Button type="submit" variant="flat" size="lg" isDisabled={isSending} isLoading={isSending}>
          {isSending ? t('common.acciones.enviando') : t('common.acciones.enviar')}
        </Button>
      </Form>
    </div>
  );
}
