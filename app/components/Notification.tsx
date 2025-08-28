"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsCheckCircle, BsExclamationTriangle, BsInfoCircle, BsX } from "react-icons/bs";
import { Button } from "./ui/Button";

interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export default function Notification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <BsCheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <BsExclamationTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <BsExclamationTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <BsInfoCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <BsInfoCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/20";
      case "error":
        return "bg-red-500/10 border-red-500/20";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "info":
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`w-full max-w-sm bg-card/95 backdrop-blur-xl border ${getBackgroundColor()} rounded-xl shadow-lg p-4`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm mb-1">
                {title}
              </h4>
              {message && (
                <p className="text-sm text-muted-foreground mb-3">
                  {message}
                </p>
              )}
              
              {action && (
                <Button
                  onClick={action.onClick}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {action.label}
                </Button>
              )}
            </div>
            
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 p-1 h-auto"
            >
              <BsX className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    (window as any).showNotification = addNotification;
    (window as any).clearNotifications = clearAll;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}

export const notification = {
  success: (title: string, message?: string, options?: Partial<NotificationProps>) => {
    (window as any).showNotification?.({
      type: "success",
      title,
      message,
      ...options
    });
  },
  
  error: (title: string, message?: string, options?: Partial<NotificationProps>) => {
    (window as any).showNotification?.({
      type: "error",
      title,
      message,
      ...options
    });
  },
  
  warning: (title: string, message?: string, options?: Partial<NotificationProps>) => {
    (window as any).showNotification?.({
      type: "warning",
      title,
      message,
      ...options
    });
  },
  
  info: (title: string, message?: string, options?: Partial<NotificationProps>) => {
    (window as any).showNotification?.({
      type: "info",
      title,
      message,
      ...options
    });
  },
  
  clear: () => {
    (window as any).clearNotifications?.();
  }
}; 