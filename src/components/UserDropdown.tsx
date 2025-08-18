"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

const UserDropdown: React.FC<UserDropdownProps> = ({ user, initials }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
            <AvatarFallback>
              {initials || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent></DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
