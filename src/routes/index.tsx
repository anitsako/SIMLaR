import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Alert } from '@heroui/react';
import { Construction } from 'lucide-react';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MapaPrincipal } from '@/mapa-principal/mapa-principal';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <>
      <div className="max-w-6xl w-full mb-8">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, Scrollbar]}
          loop={true}
          spaceBetween={100}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          scrollbar={{ draggable: true }}
          navigation
          className="w-full h-[420px]"
        >
          <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center mt-4">
            <SwiperSlide>Imagen 1</SwiperSlide>
            <SwiperSlide>Imagen 2</SwiperSlide>
            <SwiperSlide>Imagen 3</SwiperSlide>
            <SwiperSlide>Imagen 4</SwiperSlide>
            <SwiperSlide>Imagen 5</SwiperSlide>
          </div>
        </Swiper>
      </div>
      <div className="max-w-6xl w-full">
        <ClientOnly>
          <MapaPrincipal />
        </ClientOnly>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Sección de noticias destacadas en construcción
        </Alert>
      </div>
      <div className="max-w-6xl w-full">
        <Alert icon={<Construction />} color="warning">
          Sección de accesos rápidos en construcción
        </Alert>
      </div>
    </>
  );
}
