import "./globals.css";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100 overflow-hidden w-full">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}