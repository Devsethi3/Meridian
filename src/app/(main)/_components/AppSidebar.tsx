"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { SidebarOptions } from "@/lib/constants";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAccusoft } from "react-icons/fa";

const AppSidebar = () => {
  const path = usePathname();
  console.log(path);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 mt-4 justify-center">
          <FaAccusoft className="size-7 text-indigo-500" />
          <h2 className="text-2xl font-bold tracking-widest">
            <span className="text-indigo-500">First</span>View
          </h2>
        </div>
        <Button className="w-full mt-5">
          {" "}
          <Plus /> Create Interview
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SidebarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-4 py-5 ${
                      path == option.path && "bg-primary/10"
                    }`}
                  >
                    <Link href={option.path}>
                      <option.icon
                        className={`text-[16px] ${
                          path === option.path && "text-primary"
                        }`}
                      />
                      <span
                        className={`text-[16px] ${
                          path === option.path && "text-primary"
                        }`}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggleButton showLabel variant="circle-blur" start="top-right" />{" "}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
