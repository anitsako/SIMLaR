import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

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
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, Scrollbar]}
      loop={true}
      spaceBetween={100}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      scrollbar={{ draggable: true }}
      navigation
      className="h-[420px]"
    >
      <SwiperSlide>Imagen 1</SwiperSlide>
      <SwiperSlide>Imagen 2</SwiperSlide>
      <SwiperSlide>Imagen 3</SwiperSlide>
      <SwiperSlide>Imagen 4</SwiperSlide>
      <SwiperSlide>Imagen 5</SwiperSlide>
    </Swiper>
  );
};
