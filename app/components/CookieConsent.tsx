"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { BsShieldCheck, BsX, BsGear } from "react-icons/bs";

interface CookieConsentProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    localStorage.setItem("cookieConsent", JSON.stringify(allPreferences));
    setIsVisible(false);
    onAccept?.(allPreferences);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setIsVisible(false);
    onAccept?.(preferences);
  };

  const handleDecline = () => {
    const minimalPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    localStorage.setItem("cookieConsent", JSON.stringify(minimalPreferences));
    setIsVisible(false);
    onDecline?.();
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return;

    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 p-4"
        >
          <div className="max-w-4xl mx-auto">
            {!showSettings ? (
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BsShieldCheck className="text-primary text-lg" />
                    <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                    By clicking &apos;Accept All&apos;, you consent to our use of cookies.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="flex bg-gradient-to-r from-primary items-center gap-2 border-border/50 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <BsGear className="w-4 h-4" />
                    Customize
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-primary border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Cookie Settings</h3>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <BsX className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Necessary Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Required for the website to function properly. Cannot be disabled.
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-start px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("analytics")}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? "bg-primary justify-end" : "bg-muted justify-start"
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Used to deliver personalized advertisements and track campaign performance.
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("marketing")}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? "bg-primary justify-end" : "bg-muted justify-start"
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Functional Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable enhanced functionality and personalization.
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("functional")}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.functional ? "bg-primary justify-end" : "bg-muted justify-start"
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                    className="border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Decline All
                  </Button>
                  <Button
                    onClick={handleAcceptSelected}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}