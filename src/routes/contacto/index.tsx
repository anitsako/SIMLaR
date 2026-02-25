import {Button, Card, CardBody, CardFooter, CardHeader, Image } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { GoogleMaps } from '@/common/google-maps-svg';
import Formulario from '@/form-consultas/form';
import { ContactoInstitucional } from '@/form-consultas/contacto-institucional';

export const Route = createFileRoute('/contacto/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="max-w-6xl w-full mt-4 mb-8">
        <p className="text-5xl font-bold text-center">Contacto</p>
      </div>
      {/* <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Contacto institucional</p>
      </div> */}
      <div className="max-w-6xl w-full">
        <ContactoInstitucional />
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold mb-4">Ubicación</p>
        <Card className="flex flex-row items-center gap-4 w-200">
          <Image
            src="https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=QxtLXoEX57hPXT4yG2d3Zw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=335.22635&pitch=0&thumbfov=100"
            alt="Ubicación de la institución"
            height={300}
            width={300}
            className="rounded-lg object-cover"
          />
          <div className="flex flex-col justify-between">
            <CardHeader className="p-0">
              <p className="text-4xl font-bold">Dirección</p>
            </CardHeader>

            <CardBody className="p-0 py-2 flex flex-row items-center">
              <p className="text-2xl">Pelagio B.Luna 173 (5300) La Rioja</p>
            </CardBody>

            <CardFooter className="p-0">
              <Button
                color="primary"
                size="lg"
                as='a'
                href="https://www.google.com/maps/place/EMSE/@-29.4114941,-66.850607,15z/data=!4m6!3m5!1s0x9427dbceeb2c1623:0x29e8bdc76eefe5fd!8m2!3d-29.4114941!4d-66.850607!16s%2Fg%2F11kjlzvjrj?entry=ttu&g_ep=EgoyMDI2MDIwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                className='flex items-center gap-2'
              >
                Ver en Google Maps
                <GoogleMaps className="w-6 h-6" />
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <p className="text-3xl font-bold">Formulario de consultas</p>
      </div>
      <div className="max-w-6xl w-full mt-4">
        <Formulario />
      </div>
    </>
  );
}
