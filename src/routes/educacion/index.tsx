import { Link, createFileRoute } from '@tanstack/react-router';
import { Construction } from 'lucide-react';
import { Alert, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';

export const Route = createFileRoute('/educacion/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-5xl font-bold flex justify-center">Educación minera</h1>
      <div className="flex flex-row gap-4">
        <Link to="/educacion/informativa">
          <Card className="w-xl py-4 transition duration-200 ease-in-out hover:scale-102 cursor-pointer">
            <CardHeader>
              <p className="text-2xl font-bold">Sección Informativa</p>
            </CardHeader>
            <CardBody>Aquí se encuentra el contenido informativo sobre minería.</CardBody>
          </Card>
        </Link>
        {/* <Link to="/educacion/dinamica"> */}
        <Card className="w-xl py-4 transition duration-200 ease-in-out hover:scale-102 cursor-pointer">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-2xl font-bold">Sección Dinámica</p>
          </CardHeader>
          <CardBody>Aquí se encuentra el contenido dinámico sobre minería, con actividades interactivas. </CardBody>
          <CardFooter>
            <Alert icon={<Construction />} color="warning">
              En construcción
            </Alert>
          </CardFooter>
        </Card>
        {/* </Link> */}
      </div>
    </div>
  );
}
