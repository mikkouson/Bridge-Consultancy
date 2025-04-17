import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

export const SuccessToast = ({ message }: { message: string }) => {
  useEffect(() => {
    toast({
      variant: "success",
      className: "border-0",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>{message}</span>
        </div>
      ),
      duration: 2000,
    });
  }, [message]);

  return null; // Nothing to render
};
