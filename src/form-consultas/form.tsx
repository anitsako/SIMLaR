import { Button, Card, CardBody, Form, Input, Textarea, addToast } from '@heroui/react';
import { useState } from 'react';
// import Lottie from 'lottie-react';
// import HandShake from '../assets/lotties/Handshake Loop.json';

export default function Formulario() {
  const [isSending, setIsSending] = useState(false);

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
        title: 'Consulta muy corta',
        description: 'Por favor, escribí una consulta más detallada (al menos 50 caracteres).',
        color: 'warning',
        variant: 'solid',
      });
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consulta }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Si el server manda un mensaje, usalo
        const msg = data?.error ?? 'Error al enviar el formulario';
        throw new Error(msg);
      }

      addToast({
        title: '¡Gracias por contactarnos!',
        description: 'Tu consulta ha sido enviada correctamente.',
        color: 'success',
        variant: 'solid',
      });
      form.reset(); // limpia los inputs
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      addToast({
        title: 'Error al enviar',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al enviar tu consulta. Por favor, intentá nuevamente.',
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
            Por favor, ingresá tu email y tu consulta en el formulario. Nos pondremos en contacto contigo lo antes
            posible para brindarte la asistencia que necesitás.
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
          label="Email"
          labelPlacement="outside"
          type="email"
          name="email"
          placeholder="Ingresa tu email"
          classNames={{
            label: 'text-xl font-medium',
            input: '!text-slate-900 text-lg placeholder:text-slate-400',
            errorMessage: 'text-md',
          }}
        />
        <Textarea
          isRequired
          label="Consulta"
          labelPlacement="outside"
          name="consulta"
          placeholder="Ingresa tu consulta"
          classNames={{
            label: 'text-xl font-medium',
            input: '!text-slate-900 text-lg placeholder:text-slate-400 min-h-[250px] max-h-[250px]',
            errorMessage: 'text-md',
          }}
        />
        <Button type="submit" variant="flat" size="lg" isDisabled={isSending} isLoading={isSending}>
          {isSending ? 'Enviando...' : 'Enviar'}
        </Button>
      </Form>
    </div>
  );
}
