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
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      scrollbar={{ draggable: true }}
      navigation
      className="h-[400px] w-full"
    >
      <SwiperSlide className="h-full">
        <img
          src="mineria-estatico/img-lr.jpg"
          alt="personal de mineria la rioja"
          className="h-full w-full object-cover"
        />
      </SwiperSlide>
      <SwiperSlide className="h-full">
        <img src="/mineria-estatico/img-lr-toronto.jpeg" alt="pdac la rioja-toronto" className="w-full object-cover" />
      </SwiperSlide>

      <SwiperSlide className="h-full">
        <img src="/mineria-estatico/img-lr-gob.jpg" alt="gobierno de la rioja" className="h-full w-full object-cover" />
      </SwiperSlide>

      <SwiperSlide className="h-full">
        <img
          src="/mineria-estatico/exploracion.jpeg"
          alt="dos trabajadores explorando una mina"
          className="h-full w-full object-cover"
        />
      </SwiperSlide>
    </Swiper>
  );
};
