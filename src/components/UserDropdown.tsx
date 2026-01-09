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
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Loader2,
  CheckCircle2,
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
  initials: string | null;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  initials,
}) => {
  const isAuthed = Boolean(user);
  const name = user?.name ?? "Guest";
  const email = user?.email ?? "Not signed in";

  const { signOut, error, isLoading } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 p-[1px]">
          <Avatar className="h-9 w-9 ring-1 ring-border/50">
            <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {initials || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-0 bg-transparent border-0"
        align="end"
        sideOffset={8}
        forceMount
      >
        <div className="rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 p-[1px]">
          <div className="rounded-lg bg-card/95 backdrop-blur-sm border border-border/50">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <div className="rounded-full bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px]">
                <Avatar className="h-11 w-11 ring-1 ring-border/50">
                  <AvatarImage
                    src={user?.picture || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {initials || <UserIcon className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>

            {/* Auth Actions for Non-authenticated Users */}
            {!isAuthed && (
              <div className="p-3 space-y-2">
                <Button asChild size="sm" className="w-full">
                  <Link href="/auth?view=auth">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  <Link href="/auth?view=auth&mode=signup">Create Account</Link>
                </Button>
              </div>
            )}

            {/* Menu Items for Authenticated Users */}
            {isAuthed && (
              <div className="py-1">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="mx-1 rounded-lg transition-all duration-200 hover:bg-muted/50"
                  >
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="mx-2" />

                <DropdownMenuItem
                  className="mx-1 rounded-lg transition-all duration-200 hover:bg-destructive/10 cursor-pointer"
                  disabled={isLoading}
                  onSelect={(e) => {
                    e.preventDefault();
                    void signOut();
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{isLoading ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>

                {/* Status Indicator */}
                <div className="mx-3 my-2 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-3 ring-1 ring-primary/20">
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                    <span>You&apos;re signed in and ready to go!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mx-3 mb-3 rounded-lg bg-destructive/10 border border-destructive/20 p-2">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
