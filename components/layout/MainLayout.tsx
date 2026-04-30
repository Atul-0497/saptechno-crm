"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useCustomization } from "../../contexts/CustomizationContext";
import { Toaster } from "react-hot-toast";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { layout } = useCustomization();

  return (
    <div className="flex h-screen dark:bg-slate-950 overflow-hidden w-full transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <Toaster position="top-right" />
        <main className="overflow-y-auto flex-1 dark:bg-slate-950">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
