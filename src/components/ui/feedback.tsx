import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface FeedbackProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
  show?: boolean;
  onClose?: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  type,
  message,
  className,
  show = true,
  onClose,
}) => {
  if (!show) return null;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "flex items-center p-4 mb-4 text-sm border rounded-lg fade-in",
        colors[type],
        className
      )}
      role="alert"
    >
      <Icon
        className={cn("flex-shrink-0 inline w-4 h-4 mr-3", iconColors[type])}
      />
      <span className="sr-only">{type}</span>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          type="button"
          className={cn(
            "ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-20",
            iconColors[type]
          )}
          onClick={onClose}
          aria-label="Fechar"
        >
          <span className="sr-only">Fechar</span>
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Toast notification component
interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm fade-in">
      <Feedback type={type} message={message} onClose={onClose} />
    </div>
  );
};
