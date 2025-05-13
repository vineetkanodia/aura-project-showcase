
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-9 h-9 bg-secondary/50 hover:bg-secondary transition-all"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-accent animate-in fade-in" />
      ) : (
        <Moon className="h-4 w-4 text-primary animate-in fade-in" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
