
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // We don't need toasts array since we're using sonner
  return (
    <ToastProvider>
      {/* Sonner will handle the toasts */}
      <ToastViewport />
    </ToastProvider>
  )
}
