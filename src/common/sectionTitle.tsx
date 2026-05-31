

export default function SectionTitle({
  title,
  subtitle,
  rightSlot,
  textCenter,
  fontSemiBold,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  textCenter?: boolean;
  fontSemiBold?: boolean;
}) {
  return (
    <div className={`flex items-center ${textCenter ? 'justify-center' : 'justify-between'} gap-4 w-full border-b border-primary/50 pb-2`} >
      <div className="flex flex-col">

        <h1
          className={`text-3xl ${fontSemiBold ? 'font-semibold' : 'font-bold'} ${textCenter ? 'text-center' : ''}  md:text-4xl`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className={`text-lg text-muted-foreground ${textCenter ? 'text-center' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot && (
        <div>
          {rightSlot}
        </div>
      )}

    </div>
  );
}
