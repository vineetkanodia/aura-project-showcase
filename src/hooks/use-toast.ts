
import * as React from "react"
import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success" | "warning" | "info"
}

export function useToast() {
  const toast = (props: ToastProps) => {
    // Map variant to proper sonner toast type
    if (props.variant === "destructive") {
      sonnerToast.error(props.title, { description: props.description });
    } else if (props.variant === "success") {
      sonnerToast.success(props.title, { description: props.description });
    } else if (props.variant === "warning") {
      sonnerToast.warning(props.title, { description: props.description });
    } else if (props.variant === "info") {
      sonnerToast.info(props.title, { description: props.description });
    } else {
      sonnerToast(props.title, { description: props.description });
    }
  };

  // Special toast variants for ease of use
  toast.error = (title: string, description?: string) => {
    sonnerToast.error(title, { description });
  };
  
  toast.success = (title: string, description?: string) => {
    sonnerToast.success(title, { description });
  };
  
  toast.warning = (title: string, description?: string) => {
    sonnerToast.warning(title, { description });
  };
  
  toast.info = (title: string, description?: string) => {
    sonnerToast.info(title, { description });
  };

  return {
    toast
  };
}

export { useToast as toast };
