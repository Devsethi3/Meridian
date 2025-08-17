import Link from "next/link";

export function HoverLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
