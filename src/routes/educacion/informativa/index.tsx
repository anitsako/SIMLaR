import { Link, createFileRoute } from '@tanstack/react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@heroui/react';
import { Navigation } from 'swiper/modules';
import { datosMinerales } from 'src/minerales-educacion/datos-minerales';
import Mineral from 'src/minerales-educacion/minerales';

// @ts-ignore: Se ignora css
import 'swiper/css';
// @ts-ignore: Se ignora css
import 'swiper/css/navigation';

export const Route = createFileRoute('/educacion/informativa/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-6xl mx-auto px-25 overflow-visible">
      <div className="flex flex-row justify-center mt-5 gap-4">
        <Link to="/educacion">
          <Button variant="flat" color="primary">
            ← Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-center">Sección Informativa</h1>
      </div>
      <Swiper cssMode={true} navigation={true} spaceBetween={50} slidesPerView={1} modules={[Navigation]}>
        {datosMinerales.map((mineral) => (
          <SwiperSlide key={mineral.name}>
            <Mineral mineral={mineral} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
