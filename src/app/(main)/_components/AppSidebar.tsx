"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { SidebarOptions } from "@/lib/constants";
import {
  Plus,
  ChevronsUpDown,
  Copy,
  CreditCard,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Image from "next/image";
import { useSignOut } from "@/hooks/use-sign-out";

const AppSidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const displayName =
    (user?.name as string) || (user?.email?.split("@")[0] as string) || "User";

  const email = user?.email || "";
  const avatarUrl = (user?.picture as string) || "";

  const initials =
    displayName
      ?.split(" ")
      .map((s) => s?.[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copied");
    } catch {
      /* ignore */
    }
  };

  const { signOut, error, isLoading } = useSignOut();

  return (
    <Sidebar className="bg-card text-card-foreground border-border">
      {/* Logo */}
      <SidebarHeader className="border-b border-border">
        <div className="mt-3 flex items-center justify-center gap-3 px-3">
          <Image
            src="/logo-light.svg"
            width={27}
            height={27}
            alt="logo"
            className="block dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            width={27}
            height={27}
            alt="logo"
            className="dark:block hidden"
          />{" "}
          <div className="min-w-0">
            <h2 className="truncate text-xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/70">
              Meridian
            </h2>
          </div>
        </div>

        <div className="px-3 pb-3 pt-4">
          <Link href="/dashboard/create-interview">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Interview
            </Button>
          </Link>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {SidebarOptions.map((option, i) => {
              const isActive = pathname === option.path;
              return (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton
                    asChild
                    className={[
                      "group w-full rounded-md border border-transparent px-3 py-2.5 transition",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Link
                      href={option.path}
                      className="flex items-center gap-2"
                    >
                      <option.icon
                        className={[
                          "h-4 w-4",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        ].join(" ")}
                      />
                      <span className="truncate text-sm">{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border">
        {/* Theme row */}
        <div className="flex items-center justify-between px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">Theme</p>
          </div>
          <ThemeToggleButton showLabel={false} />
        </div>

        {/* User account */}
        {user ? (
          <div className="px-3 pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex w-full items-center gap-3 rounded-md border border-transparent bg-muted/50 px-3 py-2.5 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Open account menu"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {displayName}
                    </p>
                    <p className="hidden truncate text-xs text-muted-foreground sm:block">
                      {email}
                    </p>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 border border-border bg-popover text-popover-foreground"
              >
                <DropdownMenuLabel className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={copyEmail}
                  className="flex items-center"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy email
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isLoading}
                  onSelect={(e) => {
                    e.preventDefault();
                    void signOut();
                  }}
                  className="flex items-center text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="px-3 pb-3">
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
