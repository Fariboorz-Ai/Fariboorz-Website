"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BsArrowUp, BsChat, BsWhatsapp } from "react-icons/bs";
import { Button } from "./ui/Button";
import Link from "next/link";
export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const actions = [
    {
      icon: BsChat,
      label: "Live Chat",
      href: "#",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: BsWhatsapp,
      label: "WhatsApp",
      href: "#",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
 
          <AnimatePresence>
            {isExpanded && (
              <div className="mb-4 space-y-3">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                  >
                    <Button
                      asChild
                      className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    >
                      <Link
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        title={action.label}
                      >
                        <action.icon className="w-5 h-5" />
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

         
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end"
          >
       
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 hover:border-primary/50 hover:bg-primary/10 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <BsArrowUp className="w-5 h-5" />
              </motion.div>
            </Button>

          
            <Button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              <BsArrowUp className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 