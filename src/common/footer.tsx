import { Button, Image } from '@heroui/react';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full">
      <div
        className="w-full text-white"
        style={{
          backgroundImage: `url('/images/footer-trama-gris.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#606062',
        }}
      >
        <div className="w-full bg-black/40">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex items-start gap-4">
                <Image
                  src="/images/la-rioja-gobierno-white.png"
                  alt="La Rioja Gobierno"
                  className="h-16 w-auto"
                  radius="none"
                />

                <div>
                  <p className="text-2xl font-semibold tracking-wide">LA RIOJA</p>
                  <p className="text-sm tracking-[0.35em] opacity-90">GOBIERNO</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Contacto</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <MapPin className="h-4 w-4 mt-1" />
                    25 de Mayo y San Nicolás de Bari, Ciudad de La Rioja
                  </li>
                  <li className="flex gap-3">
                    <Phone className="h-4 w-4 mt-1" />
                    +54 0380 4453156 | +54 0380 4453039 (Fax)
                  </li>
                  <li className="flex gap-3">
                    <Mail className="h-4 w-4 mt-1" />
                    info@larioja.gob.ar
                  </li>
                </ul>
              </div>

              <div className="md:text-right">
                <h3 className="text-xl font-semibold mb-4">Descargá La Rioja Provincia</h3>

                <div className="flex md:justify-end gap-3">
                  <Button variant="bordered" className="border-white text-white hover:bg-white/10">
                    Google Play
                  </Button>

                  <Button variant="bordered" className="border-white text-white hover:bg-white/10">
                    App Store
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#E62138]">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-white">
          © 2026 | Gobierno de la Provincia de La Rioja
        </div>
      </div>
    </footer>
  );
};

