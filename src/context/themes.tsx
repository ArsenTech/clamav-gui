import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = Exclude<Theme,"system">

type ThemeProviderProps = {
     children: React.ReactNode
     defaultTheme?: Theme
     storageKey?: string
}

type ThemeProviderState = {
     theme: Theme,
     resolvedTheme: ResolvedTheme | null
     setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
     theme: "system",
     resolvedTheme: null,
     setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
     children,
     defaultTheme = "system",
     storageKey = "clamav-ui-theme",
     ...props
}: ThemeProviderProps) {
     const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);
     const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | null>(null)
     useEffect(() => {
          const root = document.documentElement
          const media = window.matchMedia("(prefers-color-scheme: dark)")

          const applyTheme = (resolved: ResolvedTheme) => {
               root.classList.remove("light", "dark")
               root.classList.add(resolved)
               setResolvedTheme(resolved)
          }
          if (theme === "system") {
               applyTheme(media.matches ? "dark" : "light")
          } else {
               applyTheme(theme)
          }
          const handleChange = (e: MediaQueryListEvent) => {
               if (theme === "system") {
                    applyTheme(e.matches ? "dark" : "light")
               }
          }
          media.addEventListener("change", handleChange)
          return () => media.removeEventListener("change", handleChange)
     }, [theme])
     const value = {
          theme,
          resolvedTheme,
          setTheme: (theme: Theme) => {
               localStorage.setItem(storageKey, theme)
               setTheme(theme)
          },
     }
     return (
          <ThemeProviderContext.Provider {...props} value={value}>
               {children}
          </ThemeProviderContext.Provider>
     )
}

export const useTheme = () => {
     const context = useContext(ThemeProviderContext)
     if (context === undefined)
          throw new Error("useTheme must be used within a ThemeProvider")
     return context
}