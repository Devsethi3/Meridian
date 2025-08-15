"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AppSidebar from "./_components/AppSidebar";
import WelcomeInterface from "./dashboard/_components/WelcomeInterface";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { HelpCircle, Sparkles, BookOpen, LifeBuoy } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="min-h-screen w-full bg-background text-foreground">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="border border-border bg-muted hover:bg-muted/80" />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Menu
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Open help"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="z-50 w-[min(22rem,90vw)] rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-lg">
                <div className="p-4 sm:p-5">
                  {/* Header */}
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold">Need help?</h4>
                      <p className="text-xs text-muted-foreground">
                        FirstView helps you create, manage, and share interview
                        sessions.
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  <ul className="mt-3 space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-primary">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <p className="min-w-0 leading-relaxed">
                        Create a new interview from the sidebar or the “Create
                        Interview” button in the header.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-primary">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <p className="min-w-0 leading-relaxed">
                        Use filters and search to quickly find past interviews
                        by role, description, or ID.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-primary">
                        <LifeBuoy className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <p className="min-w-0 leading-relaxed">
                        Share links with candidates and review results anytime
                        from your dashboard.
                      </p>
                    </li>
                  </ul>

                  {/* Links */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href="/docs"
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Read the docs
                    </Link>
                    <Link
                      href="/support"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Contact support
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggleButton showLabel={false} />
          </div>
        </header>

        {/* Page content */}
        <main className="px-2 py-4 md:px-4 lg:px-8">
          <WelcomeInterface />
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
