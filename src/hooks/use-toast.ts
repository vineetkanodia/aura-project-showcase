
import * as React from "react"
import { useToast as useToastSonner } from "sonner"

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
      useToastSonner.error(props.title, { description: props.description });
    } else if (props.variant === "success") {
      useToastSonner.success(props.title, { description: props.description });
    } else if (props.variant === "warning") {
      useToastSonner.warning(props.title, { description: props.description });
    } else if (props.variant === "info") {
      useToastSonner.info(props.title, { description: props.description });
    } else {
      useToastSonner(props.title, { description: props.description });
    }
  };

  // Special toast variants for ease of use
  toast.error = (title: string, description?: string) => {
    useToastSonner.error(title, { description });
  };
  
  toast.success = (title: string, description?: string) => {
    useToastSonner.success(title, { description });
  };
  
  toast.warning = (title: string, description?: string) => {
    useToastSonner.warning(title, { description });
  };
  
  toast.info = (title: string, description?: string) => {
    useToastSonner.info(title, { description });
  };

  return {
    toast
  };
}

export { useToast as toast };
