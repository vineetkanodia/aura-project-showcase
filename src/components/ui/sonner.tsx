
import { useTheme } from "@/context/ThemeProvider"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:bg-green-500/20 group-[.toast]:text-green-500 group-[.toast]:border-green-500/20",
          error: "group-[.toast]:bg-red-500/20 group-[.toast]:text-red-500 group-[.toast]:border-red-500/20",
          info: "group-[.toast]:bg-blue-500/20 group-[.toast]:text-blue-500 group-[.toast]:border-blue-500/20",
          warning: "group-[.toast]:bg-yellow-500/20 group-[.toast]:text-yellow-500 group-[.toast]:border-yellow-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
