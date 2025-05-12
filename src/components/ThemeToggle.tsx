
import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle = ({ className, showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {showLabel && (
        <span className="text-sm font-medium mr-2 transition-colors">
          {theme === "light" ? "Light" : "Dark"} Mode
        </span>
      )}
      
      <motion.button
        onClick={toggleTheme}
        className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-secondary/80 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === "dark" ? 180 : 0,
            scale: theme === "dark" ? 0.7 : 1
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {theme === "light" ? (
            <Sun 
              size={22} 
              className="text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
            />
          ) : (
            <Moon 
              size={22} 
              className="text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]" 
            />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
