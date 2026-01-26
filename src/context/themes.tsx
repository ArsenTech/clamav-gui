import { COLORS } from "@/lib/constants/colors";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = Exclude<Theme, "system">;
type Color = keyof typeof COLORS;

type ThemeProviderProps = {
     children: React.ReactNode;
     defaultTheme?: Theme;
     defaultColor?: Color;
     storageThemeKey?: string;
     storageColorKey?: string;
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
     defaultTheme = "system",
     defaultColor = "blue",
     storageThemeKey = "clamav-ui-theme",
     storageColorKey = "clamav-ui-color",
}: ThemeProviderProps) {
     const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageThemeKey) as Theme) || defaultTheme);
     const [color, setColor] = useState<Color>(() => (localStorage.getItem(storageColorKey) as Color) || defaultColor);
     const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | null>(null);

     useEffect(() => {
          const root = document.documentElement;
          const media = window.matchMedia("(prefers-color-scheme: dark)");
          const applyTheme = (resolved: ResolvedTheme) => {
               root.classList.remove("light", "dark");
               root.classList.add(resolved);
               setResolvedTheme(resolved);
          };
          if (theme === "system") {
               applyTheme(media.matches ? "dark" : "light");
          } else {
               applyTheme(theme);
          }
          const handleChange = (e: MediaQueryListEvent) => {
               if (theme === "system") {
                    applyTheme(e.matches ? "dark" : "light");
               }
          };
          media.addEventListener("change", handleChange);
          return () => media.removeEventListener("change", handleChange);
     }, [theme]);

     useEffect(() => {
          if (!resolvedTheme) return;
          const colorDef = COLORS[color];
          if (!colorDef) {
               console.error(`Invalid color "${color}". Available: ${Object.keys(COLORS).join(", ")}`);
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
               ...Object.fromEntries(
                    Object.entries(modeStyles.sidebar ?? {}).map(([k, v]) => [
                         `sidebar-${k}`,
                         v,
                    ])
               ),
          };
          Object.entries(flatEntries).forEach(([key, value]) => {
               if (typeof value !== "string") return;
               root.style.setProperty(
                    `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
                    value
               );
          });
          root.dataset.themeColor = color;
     }, [color, resolvedTheme]);

     const value: ThemeProviderState = {
          theme,
          resolvedTheme,
          color,
          setTheme: (t) => {
               localStorage.setItem(storageThemeKey, t);
               setTheme(t);
          },
          setColor: (c) => {
               localStorage.setItem(storageColorKey, c);
               setColor(c);
          },
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