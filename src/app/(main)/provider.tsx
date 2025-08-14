import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WelcomeInterface from "./dashboard/_components/WelcomeInterface";
import AppSidebar from "./_components/AppSidebar";

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full lg:p-8 md:p-4 p-2 bg-secondary">
          <SidebarTrigger />
          <WelcomeInterface />

          {children}
        </div>
      </SidebarProvider>
    </>
  );
};

export default DashboardProvider;
