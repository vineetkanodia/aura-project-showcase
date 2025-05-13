
import { toast } from "sonner";

export { toast };

// Export a skeleton version of useToast for backward compatibility
export const useToast = () => {
  return {
    toast: (props: any) => {
      if (typeof props === "string") {
        toast(props);
      } else if (props?.title) {
        if (props.variant === "destructive") {
          toast.error(props.title, {
            description: props.description,
          });
        } else if (props.variant === "success") {
          toast.success(props.title, {
            description: props.description,
          });
        } else {
          toast(props.title, {
            description: props.description,
          });
        }
      }
    }
  };
};
