import { createFileRoute } from '@tanstack/react-router'
import { TallerArtesanias } from '@/common/taller-artesanias'
import { SectionHeader } from '@/common/section-header'
import SectionTitle from '@/common/section-title'

export const Route = createFileRoute('/programas/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <section>
    <SectionTitle title='Programas' />
    <SectionHeader
      title="Taller de Artesanías"
      subtitle="La minería con identidad riojana incluye de manera especial el fomento y la visibilización de la pequeña escala y el trabajo artesanal."
    />
    <TallerArtesanias />
  </section>
}
