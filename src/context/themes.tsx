import useSettings from "@/hooks/use-settings";
import { COLORS } from "@/lib/constants/colors";
import { Color, ResolvedTheme, Theme } from "@/lib/types/settings";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeProviderProps = {
     children: React.ReactNode;
};

type ThemeProviderState = {
     theme: Theme;
     resolvedTheme: ResolvedTheme | null;
     color: Color;
     setTheme: (theme: Theme) => void;
     setColor: (color: Color) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

export function ThemeProvider({
     children,
}: ThemeProviderProps) {
     const {settings, setSettings} = useSettings()
     const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | null>(null);

     useEffect(() => {
          const root = document.documentElement;
          const media = window.matchMedia("(prefers-color-scheme: dark)");
          const applyTheme = (resolved: ResolvedTheme) => {
               root.classList.remove("light", "dark");
               root.classList.add(resolved);
               setResolvedTheme(resolved);
          };
          applyTheme(settings.theme === "system" ? media.matches ? "dark" : "light" : settings.theme);
          const handleChange = (e: MediaQueryListEvent) => {
               if (settings.theme === "system") 
                    applyTheme(e.matches ? "dark" : "light");
          };
          media.addEventListener("change", handleChange);
          return () => media.removeEventListener("change", handleChange);
     }, [settings.theme]);

     useEffect(() => {
          if (!resolvedTheme) return;
          const colorDef = COLORS[settings.color];
          if (!colorDef) {
               console.error(`Invalid color "${settings.color}". Available: ${Object.keys(COLORS).join(", ")}`);
               return;
          }
          const { charts, ...uiColor } = colorDef;
          const modeStyles = uiColor[resolvedTheme];
          if (!modeStyles) return;

          const root = document.documentElement;
          if (Array.isArray(charts)) 
               charts.forEach((v, i) =>root.style.setProperty(`--chart-${i + 1}`, v));

          const flatEntries = {
               ...modeStyles,
               ...Object.fromEntries(Object.entries(modeStyles.sidebar ?? {}).map(([k, v]) => [`sidebar-${k}`,v,])),
          };
          Object.entries(flatEntries).forEach(([key, value]) => {
               if (typeof value !== "string") return;
               root.style.setProperty(
                    `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
                    value
               );
          });
          root.dataset.themeColor = settings.color;
     }, [settings.color, resolvedTheme]);

     const value: ThemeProviderState = {
          theme: settings.theme,
          resolvedTheme,
          color: settings.color,
          setTheme: t => setSettings({ theme: t }),
          setColor: c => setSettings({ color: c }),
     };

     return (
          <ThemeProviderContext.Provider value={value}>
               {children}
          </ThemeProviderContext.Provider>
     );
}

export const useTheme = () => {
     const ctx = useContext(ThemeProviderContext);
     if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
     return ctx;
};