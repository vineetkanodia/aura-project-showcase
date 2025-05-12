
import { createContext, useContext, useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Check if we have a theme in localStorage or use system preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) return savedTheme;
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "dark";
      }
    }
    
    return "light";
  });

  // Update document with theme change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Apply theme with transition
    const transitionTheme = () => {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // Add transition class for smooth theme change
    root.classList.add("transition-colors");
    
    // Apply theme change
    transitionTheme();
    
    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Remove transition class after theme change is complete
    const tid = setTimeout(() => {
      root.classList.remove("transition-colors");
    }, 300);

    return () => clearTimeout(tid);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
  };

  const value = { theme, toggleTheme };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
