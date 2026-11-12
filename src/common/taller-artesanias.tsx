import { useState } from 'react';
import { Card, CardBody, Modal, ModalBody, ModalContent } from '@heroui/react';


const TEXTO_CUERPO =
  'A través del Taller de Piedra, la Secretaría promueve de forma activa el agregado de valor en origen a las rocas de aplicación y minerales industriales característicos de nuestra tierra, tales como el granito, la laja y el travertino.';

const IMAGEN_PRINCIPAL: { src: string; alt: string } | null = {
  src: '/images/taller-artesanias/03.jpg',
  alt: 'Taller de Artesanías',
};

const GALERIA: Array<string> = [
  '/images/taller-artesanias/01.jpg',
  '/images/taller-artesanias/02.jpg',
  '/images/taller-artesanias/06.jpg',
  '/images/taller-artesanias/04.jpg',
  '/images/taller-artesanias/05.jpg',
  '/images/taller-artesanias/07.jpg',
];

type ImagenSeleccionada = { src: string; alt: string };

export function TallerArtesanias() {
  const [seleccionada, setSeleccionada] = useState<ImagenSeleccionada | null>(null);

  return (
    <div className="space-y-6">
      <div className="relative">
        {IMAGEN_PRINCIPAL ? (
          <img
            src={IMAGEN_PRINCIPAL.src}
            alt={IMAGEN_PRINCIPAL.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-lg object-cover md:aspect-[21/9]"
          />
        ) : (
          <div className="aspect-[4/3] w-full rounded-lg bg-default-200 md:aspect-[21/9]" aria-hidden="true" />
        )}

        <Card
          shadow="sm"
          className="mt-4 rounded-lg bg-white/85 backdrop-blur-sm md:absolute md:bottom-5 md:left-5 md:mt-0 md:max-w-sm"
        >
          <CardBody className="p-5">
            <p className="text-sm leading-relaxed text-black/70">{TEXTO_CUERPO}</p>
          </CardBody>
        </Card>
      </div>

      {GALERIA.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GALERIA.map((src, i) => {
            const alt = `Artesanía en piedra ${i + 1}`;

            return (
              <button
                key={src}
                type="button"
                onClick={() => setSeleccionada({ src, alt })}
                aria-label={`Ver imagen ampliada: ${alt}`}
                className="group overflow-hidden cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-default-700"
              >
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      )}

      <Modal
        backdrop='blur'
        isOpen={seleccionada !== null}
        onClose={() => setSeleccionada(null)}
        size="5xl"
        aria-label="Vista ampliada de la imagen"
        classNames={{
          closeButton: "bg-white hover:bg-black/50 hover:text-white active:bg-black/80"
        }}
      >
        <ModalContent>
          {seleccionada && (
            <img
              src={seleccionada.src}
              alt={seleccionada.alt}
              className="max-h-[80vh] w-full object-contain rounded-lg"
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
