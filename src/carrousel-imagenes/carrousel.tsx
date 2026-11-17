import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { useImagenesCarrousel } from './use-imagenes-carrousel';

// Por el momento se deja el carrousel sin props,
// pero se pueden agregar en el futuro para hacerlo más dinámico y reutilizable

// @ts-ignore: Se ignora css
import 'swiper/css';
// @ts-ignore: Se ignora css
import 'swiper/css/navigation';
// @ts-ignore: Se ignora css
import 'swiper/css/pagination';
// @ts-ignore: Se ignora css
import 'swiper/css/scrollbar';

export const Carrousel = () => {
  const { t } = useTranslation();
  const { data: imagenes } = useImagenesCarrousel();

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, Scrollbar]}
      loop={imagenes.length >= 4}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      scrollbar={{ draggable: true }}
      navigation
      className="h-[300px] w-full max-w-full overflow-hidden min-w-0"
    >
      {imagenes.map((imagen, index) => (
        <SwiperSlide key={imagen.archivoId} className="h-full">
          <img
            src={`/archivos/${imagen.archivoId}/${imagen.nombre}`}
            alt={t('routes.inicio.carrousel.slideAlt', { n: index + 1 })}
            className="h-full w-full object-cover"
            style={{ objectPosition: `center ${imagen.positionY}%` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
