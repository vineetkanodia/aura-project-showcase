
import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Sparkles } from "lucide-react";
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
        className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-secondary/80 transition-colors overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {/* Background effects */}
        {theme === "dark" ? (
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-900/20 to-purple-700/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-200/30 to-yellow-100/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
        
        {/* Icon animation container */}
        <motion.div
          initial={false}
          animate={{ 
            rotate: theme === "dark" ? 180 : 0,
            scale: 1
          }}
          transition={{ duration: 0.6, ease: "easeInOut", type: "spring" }}
        >
          {theme === "light" ? (
            <div className="relative">
              <Sun 
                size={22} 
                className="text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
              />
              <motion.div 
                className="absolute top-[-10px] right-[-10px]"
                animate={{ 
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatDelay: 4
                }}
              >
                <Sparkles size={12} className="text-amber-400" />
              </motion.div>
            </div>
          ) : (
            <div className="relative">
              <Moon 
                size={22} 
                className="text-purple-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" 
              />
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0"
                style={{ borderRadius: "50%" }}
                animate={{
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </div>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
