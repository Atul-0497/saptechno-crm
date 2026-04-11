// app/contexts/MobileMenuContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type MobileMenuContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | null>(null);

export const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) throw new Error("useMobileMenu must be used within provider");
  return context;
};