import React from "react";
import DashboardProvider from "./provider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardProvider>
        <div>{children}</div>
      </DashboardProvider>
    </>
  );
};

export default DashboardLayout;
