
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle = ({ className, showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {showLabel && (
        <span className="text-sm font-medium mr-2">
          {theme === "light" ? "Light" : "Dark"} Mode
        </span>
      )}
      
      <div className="flex items-center space-x-2">
        <Sun size={18} className={`${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
        <Switch 
          checked={theme === "dark"} 
          onCheckedChange={toggleTheme} 
          aria-label="Toggle dark mode"
        />
        <Moon size={18} className={`${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
    </div>
  );
};

export default ThemeToggle;
