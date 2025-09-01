"use client";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { useSignOut } from "@/hooks/use-sign-out";

interface UserDropdownProps {
  user: { name?: string | null; picture?: string | null } | null;
  initials: string | null;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, initials }) => {
  const { signOut, isLoading } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 cursor-pointer rounded-lg ring-1 ring-primary/30 bg-background text-foreground">
          <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {initials || <UserIcon className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-48 p-2 bg-popover rounded-lg shadow-md">
        <div className="group rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 p-[1px]">
          <div className="rounded-xl bg-card/80 p-4 ring-1 ring-border/50 backdrop-blur">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 text-sm leading-relaxed text-muted-foreground hover:bg-muted/30 hover:border-border/50"
              disabled={isLoading}
              onSelect={() => void signOut()}
            >
              {isLoading ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
