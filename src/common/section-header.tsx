export const SectionHeader = ({
  title,
  subtitle,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}) => {
  return (
    <div className="mb-4 flex justify-between w-full border-b border-primary/50 pb-2">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-black/60">{subtitle}</p> : null}
      </div>
      {rightSlot ? <div className="self-center">{rightSlot}</div> : null}
    </div>
  );
};
