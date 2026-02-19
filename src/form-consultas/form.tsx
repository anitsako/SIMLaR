import { Button, Card, CardBody, Form, Input, Textarea } from '@heroui/react';
import Lottie from 'lottie-react';
import HandShake from '../assets/lotties/Handshake Loop.json';

export default function Formulario() {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-auto mb-10">
      <Card className="w-full flex flex-row md:w-1/2 bg-gray-50 shadow-lg">
        <CardBody className="space-y-2 flex flex-col items-center justify-center text-center p-6">
          <p className="text-2xl text-center text-slate-600 leading-relaxed">
            Por favor, ingresá tu email y tu consulta en el formulario. Nos pondremos en contacto contigo lo antes
            posible para brindarte la asistencia que necesitás.
          </p>
          <Lottie animationData={HandShake} loop={true} className="w-48" />
        </CardBody>
      </Card>
      <Form className="w-[75%] flex flex-col gap-3 rounded-lg p-5 shadow-lg bg-gray-50 text-gray-800">
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
            input: '!text-slate-900 text-lg placeholder:text-slate-400 resize-y min-h-[100px] max-h-[150px]',
            errorMessage: 'text-md',
          }}
        />
        <Button type="submit" variant="flat" size="lg">
          Enviar
        </Button>
      </Form>
    </div>
  );
}
