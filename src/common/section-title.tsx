export default function SectionTitle({
  title,
  subtitle,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className={`flex items-center w-full border-b border-primary/50 pb-2`}>
      <div className="flex flex-col">
        <h1 className={`text-3xl font-semibold md:text-4xl`}>{title}</h1>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
}
