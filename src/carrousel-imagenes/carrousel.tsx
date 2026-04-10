import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useImagenesCarrousel } from './use-imagenes-carrousel.fn';

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
  const { data: imagenes = [] } = useImagenesCarrousel();

  const slides = imagenes.map((img: any) => {
    const src = img.base64 ? `data:${img.mimeType};base64,${img.base64}` : '';

    // console.log('src', src);
    return {
      src,
      positionY: img.positionY ?? 50,
      key: img.archivoId || Math.random().toString(36).slice(2),
    };
  });

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, Scrollbar]}
      loop={true}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      scrollbar={{ draggable: true }}
      navigation
      className="h-[340px] w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.key || index} className="h-full">
          <img
            src={slide.src}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-cover"
            style={{ objectPosition: `center ${slide.positionY}%` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
