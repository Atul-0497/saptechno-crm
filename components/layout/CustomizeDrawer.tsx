"use client";

import React from "react";
import { X, Sun, Moon, Monitor, Check } from "lucide-react";
import { useCustomization, AccentColor, Density } from "../../contexts/CustomizationContext";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS: { name: AccentColor; label: string; class: string }[] = [
  { name: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { name: "blue", label: "Blue", class: "bg-blue-500" },
  { name: "violet", label: "Violet", class: "bg-violet-500" },
  { name: "rose", label: "Rose", class: "bg-rose-500" },
  { name: "orange", label: "Orange", class: "bg-orange-500" },
  { name: "slate", label: "Slate", class: "bg-slate-500" },
];

const DENSITIES: { name: Density; label: string; icon: string }[] = [
  { name: "compact", label: "Compact", icon: "≡" },
  { name: "comfortable", label: "Comfortable", icon: "≂" },
  { name: "spacious", label: "Spacious", icon: "≓" },
];

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({ isOpen, onClose }) => {
  const { accentColor, setAccentColor, density, setDensity, layout, setLayout } = useCustomization();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-950/20 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={clsx(
          "fixed right-0 top-0 z-[70] h-full w-full max-w-sm border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Customize</h2>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Personalize your CRM experience.</p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-10">
            {/* Theme Mode */}
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id)}
                    className={clsx(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                      mounted && theme === mode.id 
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                        : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                    )}
                  >
                    <mode.icon size={20} />
                    <span className="text-[11px] font-bold">{mode.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Accent Color */}
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Color</h3>
              <div className="grid grid-cols-3 gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color.name)}
                    className={clsx(
                      "group flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                      mounted && accentColor === color.name 
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                        : "border-gray-100 hover:border-gray-200 dark:border-slate-900 dark:hover:border-slate-800"
                    )}
                  >
                    <div className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110",
                      color.class
                    )}>
                      {mounted && accentColor === color.name && <Check size={14} className="text-white" />}
                    </div>
                    <span className={clsx(
                      "text-[11px] font-bold",
                      mounted && accentColor === color.name ? "text-primary" : "text-gray-500 dark:text-slate-500"
                    )}>
                      {color.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Density */}
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Density</h3>
              <div className="grid grid-cols-3 gap-3">
                {DENSITIES.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setDensity(item.name)}
                    className={clsx(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                      mounted && density === item.name 
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                        : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                    )}
                  >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Layout */}
            <section>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Layout</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "sidebar", label: "Sidebar", icon: "◫" },
                  { id: "topnav", label: "Top Nav", icon: "▭" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLayout(item.id as any)}
                    className={clsx(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                      mounted && layout === item.id 
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" 
                        : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                    )}
                  >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 dark:border-slate-800">
            <button 
              onClick={onClose}
              className="bg-premium-gradient w-full py-4 rounded-xl text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
