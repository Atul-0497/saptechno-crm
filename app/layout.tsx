import "./globals.css";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { MobileMenuProvider } from "./contexts/MobileMenuContext";
import ReactQueryProvider from "./providers/ReactQueryProvider"; 
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./components/providers/ThemeProvider";

import { CustomizationProvider } from "./contexts/CustomizationContext";

import { MainLayout } from "./components/layout/MainLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomizationProvider>
            <ReactQueryProvider>
              <MobileMenuProvider>
                <MainLayout>{children}</MainLayout>
              </MobileMenuProvider>
            </ReactQueryProvider>
          </CustomizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}