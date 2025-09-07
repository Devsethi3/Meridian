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
        <header className="sticky top-0 z-40 flex h-14 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between">
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
                    variant="outline"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    aria-label="Open help"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="z-50 w-[min(22rem,90vw)] rounded-lg border border-border bg-popover p-0 text-popover-foreground shadow-lg"
                >
                  <div className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold sm:text-sm">
                          Need help?
                        </h4>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          FirstView helps you create, manage, and share
                          interview sessions.
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-border" />

                    {/* Tips */}
                    <ul className="mt-3 space-y-2">
                      {[
                        {
                          icon: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />,
                          text: "Create a new interview from the sidebar or the “Create Interview” button in the header.",
                        },
                        {
                          icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />,
                          text: "Use filters and search to quickly find past interviews by role, description, or ID.",
                        },
                        {
                          icon: <LifeBuoy className="h-4 w-4 sm:h-5 sm:w-5" />,
                          text: "Share links with candidates and review results anytime from your dashboard.",
                        },
                      ].map((tip, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/30 focus-within:bg-muted/30"
                        >
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-primary">
                            {tip.icon}
                          </div>
                          <p className="min-w-0 text-sm leading-relaxed">
                            {tip.text}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {/* Divider */}
                    <div className="mt-4 h-px w-full bg-border" />

                    {/* Links */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href="/docs"
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        Read the docs
                      </Link>
                      <Link
                        href="/support"
                        className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        Contact support
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <ThemeToggleButton showLabel={false} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-4 container">
          <WelcomeInterface />
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
