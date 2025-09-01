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
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  User as UserIcon,
  LogOut,
  Settings,
  CreditCard,
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
  const { signOut, error, isLoading } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {initials || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        align="end"
        sideOffset={8}
        forceMount
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {initials || <UserIcon className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.name ?? "Guest"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email ?? "Not signed in"}
            </p>
          </div>
        </div>

        {isAuthed ? (
          <>
            <DropdownMenuGroup className="py-1">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoading}
              onSelect={(e) => {
                e.preventDefault();
                void signOut();
              }}
              className="py-2"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>{isLoading ? "Signing out…" : "Sign out"}</span>
            </DropdownMenuItem>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <div className="flex items-start gap-2 text-xs text-primary">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">
                        You&apos;re signed in and ready to go!
                      </span>
                    </div>
                  </div>

            {error && (
              <DropdownMenuLabel
                className="px-2 py-1.5 text-xs font-normal text-destructive"
                role="status"
              >
                {error}
              </DropdownMenuLabel>
            )}
          </>
        ) : (
          <div className="p-2 space-y-1">
            <Button asChild size="sm" className="w-full justify-center">
              <Link href="/auth?view=auth">Sign In</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="w-full justify-center"
            >
              <Link href="/auth?view=auth&mode=signup">Create Account</Link>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;