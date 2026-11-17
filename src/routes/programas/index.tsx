import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { TallerArtesanias } from '@/common/taller-artesanias';
import { SectionHeader } from '@/common/section-header';
import SectionTitle from '@/common/section-title';

export const Route = createFileRoute('/programas/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <section>
      <SectionTitle title={t('routes.programas.page.title')} subtitle={t('routes.programas.page.description')} />

      <SectionHeader
        title={t('routes.programas.tallerArtesanias.title')}
        subtitle={t('routes.programas.tallerArtesanias.intro')}
      />

      <TallerArtesanias />
    </section>
  );
}
