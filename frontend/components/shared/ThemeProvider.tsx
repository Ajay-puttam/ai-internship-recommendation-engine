"use client";

import * as React from "react";

// Minimal ThemeProvider without next-themes dependency
// Supports "dark" | "light" | "system"
type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: Theme;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}

const ThemeContext = React.createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>({ theme: "dark", setTheme: () => { } });

export function ThemeProvider({
    children,
    defaultTheme = "dark",
}: ThemeProviderProps) {
    const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

    React.useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) setThemeState(stored);
    }, []);

    React.useEffect(() => {
        const root = document.documentElement;
        const resolved =
            theme === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : theme;
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const setTheme = (t: Theme) => setThemeState(t);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => React.useContext(ThemeContext);
