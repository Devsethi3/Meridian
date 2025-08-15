import Link from "next/link";
import { Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[100svh] bg-background overflow-hidden flex items-center">
      {/* Decorative background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-muted/40 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="text-center md:text-left">
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              Page not found
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-prose mx-auto md:mx-0">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              may have been moved, renamed, or no longer exists.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center md:justify-start">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Return to the homepage"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Link>

              <Link
                href="mailto:support@example.com"
                className="inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Contact support"
              >
                <LifeBuoy className="h-4 w-4" />
                Contact Support
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-muted/30 blur-2xl"
            />
            <div className="relative rounded-2xl border bg-background/60 backdrop-blur-sm p-8 text-center shadow-sm">
              <div className="select-none text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-foreground to-muted-foreground/60 bg-clip-text text-transparent">
                404
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist.
              </p>
              <div className="mt-6 text-xs text-muted-foreground">
                Check the URL or head back to the homepage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
