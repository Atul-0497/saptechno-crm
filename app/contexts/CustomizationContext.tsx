"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type AccentColor = "blue" | "emerald" | "violet" | "rose" | "orange" | "slate";
export type Density = "compact" | "comfortable" | "spacious";
export type LayoutType = "sidebar" | "topnav";

interface CustomizationContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  density: Density;
  setDensity: (density: Density) => void;
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

const ACCENT_COLORS: Record<AccentColor, Record<string, string>> = {
  blue: {
    "--primary": "221.2 83.2% 53.3%",
    "--primary-500": "221.2 83.2% 53.3%",
    "--primary-600": "224.3 76.3% 48%",
    "--primary-700": "225.9 70.7% 40.2%",
  },
  emerald: {
    "--primary": "142.1 76.2% 36.3%",
    "--primary-500": "142.1 76.2% 36.3%",
    "--primary-600": "142.1 70.6% 29.8%",
    "--primary-700": "144.9 61.2% 20.2%",
  },
  violet: {
    "--primary": "262.1 83.3% 57.8%",
    "--primary-500": "262.1 83.3% 57.8%",
    "--primary-600": "263.4 70% 50.4%",
    "--primary-700": "263.4 69% 42.2%",
  },
  rose: {
    "--primary": "346.8 77.2% 49.8%",
    "--primary-500": "346.8 77.2% 49.8%",
    "--primary-600": "346.8 71% 42.2%",
    "--primary-700": "346.5 67.5% 34.1%",
  },
  orange: {
    "--primary": "24.6 95% 53.1%",
    "--primary-500": "24.6 95% 53.1%",
    "--primary-600": "20.5 90.2% 48.2%",
    "--primary-700": "15.3 83.2% 40.2%",
  },
  slate: {
    "--primary": "215.4 16.3% 46.9%",
    "--primary-500": "215.4 16.3% 46.9%",
    "--primary-600": "215.3 19.3% 34.5%",
    "--primary-700": "215.3 25% 26.7%",
  },
};

const DENSITY_VALUES: Record<Density, string> = {
  compact: "0.8",
  comfortable: "1",
  spacious: "1.2",
};

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<AccentColor>("blue");
  const [density, setDensity] = useState<Density>("comfortable");
  const [layout, setLayout] = useState<LayoutType>("sidebar");
  const { theme } = useTheme();

  useEffect(() => {
    const savedColor = localStorage.getItem("crm-accent-color") as AccentColor;
    const savedDensity = localStorage.getItem("crm-density") as Density;
    const savedLayout = localStorage.getItem("crm-layout") as LayoutType;
    if (savedColor) setAccentColor(savedColor);
    if (savedDensity) setDensity(savedDensity);
    if (savedLayout) setLayout(savedLayout);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const colors = ACCENT_COLORS[accentColor];

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.style.setProperty("--spacing-multiplier", DENSITY_VALUES[density]);
    
    localStorage.setItem("crm-accent-color", accentColor);
    localStorage.setItem("crm-density", density);
    localStorage.setItem("crm-layout", layout);
  }, [accentColor, density, layout, theme]);

  return (
    <CustomizationContext.Provider value={{ accentColor, setAccentColor, density, setDensity, layout, setLayout }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) throw new Error("useCustomization must be used within a CustomizationProvider");
  return context;
};
