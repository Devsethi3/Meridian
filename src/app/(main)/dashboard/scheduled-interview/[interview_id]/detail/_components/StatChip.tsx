const StatChip = ({
  icon,
  label,
  value,
  truncate,
  uppercase,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  truncate?: boolean;
  uppercase?: boolean;
}) => (
  <div className="group flex items-center gap-3 rounded-lg border border-border bg-background/60 p-4 backdrop-blur transition hover:bg-background/80">
    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/20">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={[
          "text-sm font-medium text-foreground",
          truncate ? "truncate" : "",
          uppercase ? "uppercase" : "",
        ].join(" ")}
        title={value}
      >
        {value}
      </p>
    </div>
  </div>
);

export default StatChip;
