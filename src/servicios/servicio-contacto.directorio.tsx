import { Card, CardBody } from '@heroui/react';
import { Facebook, Instagram, Mail, Share2 } from 'lucide-react';
import type { ReactNode } from 'react';


type CorreoArea = {
  id: string;
  area: string;
  email: string;
};

type RedSocial = {
  id: string;
  red: string;
  etiqueta: string;
  href: string;
  icono: ReactNode;
};

const CORREOS: Array<CorreoArea> = [
  { id: 'secretaria-mineria', area: 'Secretaría de Minería', email: 'mineria@larioja.gob.ar' },
  { id: 'direccion-general-mineria', area: 'Dirección General de Minería', email: 'direcciongeneraldemineria@larioja.gob.ar' },
  { id: 'escribania-minas', area: 'Dirección de Escribanía de Minas', email: 'escribaniademinaslr@larioja.gob.ar' },
  { id: 'catastro-minero', area: 'Dirección de Catastro Minero', email: 'catastrominerolr@larioja.gob.ar' },
  { id: 'policia-minera', area: 'Dirección de Policía Minera', email: 'policiaminerallr@larioja.gob.ar' },
  { id: 'economia-minera', area: 'Dirección de Economía Minera', email: 'economiaminerallr@larioja.gob.ar' },
  { id: 'geologia-minera', area: 'Dirección de Geología Minera', email: 'geologiamineralr@larioja.gob.ar' },
  { id: 'desarrollo-productivo', area: 'Dirección General de Desarrollo Productivo Minero', email: 'div.gral.dedes.prod.min.p@larioja.gob.ar' },
];

const REDES: Array<RedSocial> = [
  {
    id: 'instagram',
    red: 'Instagram',
    etiqueta: '@minerialarioja',
    href: 'https://www.instagram.com/minerialarioja/',
    icono: <Instagram className="h-4 w-4" />,
  },
  {
    id: 'facebook',
    red: 'Facebook',
    etiqueta: 'Secretaría de Minería La Rioja',
    href: 'https://www.facebook.com/minerialr/',
    icono: <Facebook className="h-4 w-4" />,
  },
];

function TituloCard({ icono, children }: { icono: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-default-200 pb-3">
      <span className="text-danger">{icono}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-default-500">{children}</h3>
    </div>
  );
}

export function DirectorioContacto() {
  return (
    <div className="grid gap-5">
      <Card className="rounded-none border border-default-300 shadow-sm lg:col-span-2">
        <CardBody className="p-6">
          <TituloCard icono={<Mail className="h-4 w-4" />}>Correos electrónicos</TituloCard>

          <ul className="grid gap-x-8 sm:grid-cols-2">
            {CORREOS.map((item) => (
              <li key={item.id} className="border-b border-default-100 py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <p className="text-sm text-default-700">{item.area}</p>
                <a
                  href={`mailto:${item.email}`}
                  className="break-all text-sm text-danger hover:underline"
                >
                  {item.email}
                </a>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card className="h-fit rounded-none border border-default-300 shadow-sm">
        <CardBody className="p-6">
          <TituloCard icono={<Share2 className="h-4 w-4" />}>Redes sociales</TituloCard>

          <ul>
            {REDES.map((item) => (
              <li key={item.id} className="border-b border-default-100 py-3 last:border-b-0">
                <p className="flex items-center gap-1.5 text-sm text-default-700">
                  {item.icono}
                  {item.red}
                </p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-danger hover:underline"
                >
                  {item.etiqueta}
                </a>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
