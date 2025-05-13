
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
  const { toast } = useToast();
  
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
