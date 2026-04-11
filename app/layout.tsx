import "./globals.css";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { MobileMenuProvider } from "./contexts/MobileMenuContext";
import ReactQueryProvider from "./providers/ReactQueryProvider"; 
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <ReactQueryProvider>
          <MobileMenuProvider>
            <div className="flex h-screen bg-gray-100 overflow-hidden w-full">
              
              <Sidebar />

              <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                  <Toaster position="top-right" />
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                  {children}
                </div>
              </div>

            </div>
          </MobileMenuProvider>
        </ReactQueryProvider> {/* ✅ END */}
      </body>
    </html>
  );
}