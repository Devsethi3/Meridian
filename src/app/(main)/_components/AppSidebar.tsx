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
import { Plus } from "lucide-react";
import { FaAccusoft } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

const AppSidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar className="bg-card text-card-foreground border-border">
      {/* Brand */}
      <SidebarHeader className="border-b border-border">
        <div className="mt-3 flex items-center justify-center gap-3 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
            <FaAccusoft className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-wide">
              <span className="text-primary">First</span>View
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              Interview Hub
            </p>
          </div>
        </div>

        <div className="px-3 pb-3 pt-4">
          <Link href="/interviews/new">
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
        <div className="flex items-center justify-between px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">Theme</p>
          </div>
          <ThemeToggleButton showLabel={false} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
