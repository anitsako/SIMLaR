type sizeTitle = 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
type sizeSubtitle = 'sm' | 'md' | 'lg';

export default function SectionTitle({
  title,
  subtitle,
  sizeTitle,
  sizeSubtitle,
  textCenter,
  fontSemiBold,
  responsiveMd,
}: {
  title: string;
  subtitle?: string;
  sizeTitle?: sizeTitle;
  sizeSubtitle?: sizeSubtitle;
  textCenter?: boolean;
  fontSemiBold?: boolean;
  responsiveMd?: boolean;
}) {
  return (
    <section>
      <h2
        className={`text-${sizeTitle || '3xl'} ${fontSemiBold ? 'font-semibold' : 'font-bold'} ${textCenter ? 'text-center' : ''} ${responsiveMd ? 'md:text-4xl' : ''}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-${sizeSubtitle || 'lg'} text-muted-foreground ${textCenter ? 'text-center' : ''}`}>
          {subtitle}
        </p>
      )}
    </section>
  );
}
