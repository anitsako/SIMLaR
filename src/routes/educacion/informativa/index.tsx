import { Link, createFileRoute } from '@tanstack/react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@heroui/react';
import { Navigation } from 'swiper/modules';
import { datosMinerales } from 'src/minerales-educacion/datos-minerales';
import Mineral from 'src/minerales-educacion/minerales';
import SectionTitle from '@/common/sectionTitle';

// @ts-ignore: Se ignora css
import 'swiper/css';
// @ts-ignore: Se ignora css
import 'swiper/css/navigation';

export const Route = createFileRoute('/educacion/informativa/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-4 space-y-6">
      <div className="flex flex-row justify-center mt-5 gap-4">
        <Link to="/educacion">
          <Button variant="flat" color="primary">
            ← Volver
          </Button>
        </Link>
        <SectionTitle title="Sección Informativa" sizeTitle="3xl" textCenter />
      </div>
      <Swiper cssMode={true} navigation={true} spaceBetween={50} slidesPerView={1} modules={[Navigation]}>
        {datosMinerales.map((mineral, idx) => (
          <SwiperSlide key={mineral.name}>
            <Mineral key={idx} mineral={mineral} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
