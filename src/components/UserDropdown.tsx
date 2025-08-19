"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  User as UserIcon,
  LogOut,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useSignOut } from "@/hooks/use-sign-out";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}

interface UserDropdownProps {
  user: User | null;
  onSignOut?: () => void;
  initials: string | null;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, initials }) => {
  const isAuthed = Boolean(user);
  const name = user?.name ?? "Guest";
  const email = user?.email ?? "Let&apos;s get you signed in";
  const { signOut, isLoading, error } = useSignOut();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <span className="relative inline-flex rounded-full p-[2px] bg-gradient-to-br from-primary/60 via-secondary/60 to-muted/60">
            <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-primary/30 bg-background text-foreground">
              <AvatarImage
                src={user?.picture || ""}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {initials || <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-80 p-0 border-0 bg-transparent shadow-xl"
        >
          {/* Shiny gradient border wrapper */}
          <div className="rounded-xl bg-gradient-to-br from-primary/50 via-secondary/50 to-muted/50 p-[1px]">
            {/* Inner popover surface */}
            <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-md overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-secondary/20 via-transparent to-transparent border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-1 ring-primary/30 bg-background">
                    <AvatarImage
                      src={user?.picture || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {initials || <UserIcon className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {email}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {isAuthed ? (
                    <>
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link href="/dashboard">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Go to Dashboard
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        <Link href="/billing">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Billing
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link href="/sign-in">Sign in</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        <Link href="/sign-up">Create account</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Menu */}
              <div className="py-1">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/billing" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Help & support</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="min-w-[12rem]">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/help">Help Center</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/changelog">Changelog</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/status">Status</Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-border" />

                {isAuthed ? (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/logout" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Sign out</span>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/sign-in" className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Sign in</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </div>

              {/* Footer / subtle card action */}
              <div className="px-3 pb-3">
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">
                    Tip: You can customize themes using your app’s settings.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
