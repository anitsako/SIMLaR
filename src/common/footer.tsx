import { Image } from '@heroui/react';
import { Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full">
      <div
        className="w-full text-white"
        style={{
          backgroundImage: `url('/branding/footer-trama-gris.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#606062',
        }}
      >
        <div className="w-full bg-black/40">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center">
              <div className="flex justify-center">
                <a
                  href="https://larioja.gob.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                  aria-label={t('common.gobierno.linkAria')}
                >
                  <Image
                    src="/branding/la-rioja-gobierno-white.png"
                    alt={t('common.gobierno.logoAlt')}
                    className="h-30 w-auto"
                    radius="none"
                  />
                </a>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">{t("footer.contacto")}</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center justify-center gap-3">
                    <MapPin className="h-4 w-4 mt-1" />
                    Pelagio B.Luna 173, La Rioja, Capital
                  </li>

                  <li className="flex items-center justify-center gap-3">
                    <Mail className="h-4 w-4 mt-1" />
                    <a className="hover:opacity-80 underline underline-offset-4" href="mailto:info@larioja.gob.ar">
                      simlar@emse.ar
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#E62138]">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-white">
          © 2026 | {t("footer.simlar")}
        </div>
      </div>
    </footer>
  );
};

