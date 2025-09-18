"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiMoon, FiSun, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { Button } from "./components/ui/Button";
import Icon from "./components/Icon";
import Image from "next/image";

export default function Header() {
  const [theme, setTheme] = useState<string>("light");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);   
  };

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-red-500/5" 
            : "bg-transparent"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-700/5 opacity-0 transition-opacity duration-500" 
             style={{ opacity: isScrolled ? 1 : 0 }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
         
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <Image 
                    src="/images/ICO.png" 
                    alt="Fariboorz" 
                    className="text-2xl lg:text-3xl text-white transition-transform duration-300 group-hover:scale-110" 
                    width={48} 
                    height={48} 
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent transition-all duration-300 group-hover:from-red-500 group-hover:via-red-400 group-hover:to-red-600">
                    Fariboorz
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block transition-colors duration-300 group-hover:text-red-400">
                    Advanced Trading Platform
                  </span>
                </div>
              </Link>
            </motion.div>

          
            <div className="hidden lg:flex items-center gap-8">
              
              <nav className="flex items-center gap-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Link 
                      href={item.href}
                      className="relative text-foreground hover:text-red-600 transition-colors duration-300 font-medium group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-700 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

         
              <div className="flex items-center gap-3">
              
                <motion.button
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-red-500/30 transition-all duration-300 group"
                >
                  <AnimatePresence mode="wait">
                    {theme === "light" ? (
                      <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiMoon className="text-red-600 text-lg transition-colors duration-300 group-hover:text-red-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiSun className="text-red-500 text-lg transition-colors duration-300 group-hover:text-red-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

              
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth/signin">
                    <Button className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 group">
                      <span className="relative z-10 flex items-center gap-2">
                        Access Platform
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>

        
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-red-500/30 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX className="text-foreground text-xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu className="text-foreground text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

       
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
            >
              <div className="px-4 py-6 space-y-6">
              
                <nav className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link 
                        href={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-foreground hover:text-red-600 transition-colors duration-300 font-medium py-2 border-b border-border/30 hover:border-red-500/30"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

             
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="pt-4 border-t border-border/50"
                >
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-red-500/30 transition-all duration-300"
                  >
                    <AnimatePresence mode="wait">
                      {theme === "light" ? (
                        <motion.div
                          key="moon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiMoon className="text-red-600 text-lg" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sun"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiSun className="text-red-500 text-lg" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="text-foreground font-medium">
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </span>
                  </button>
                </motion.div>

             
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="pt-4 border-t border-border/50"
                >
                  <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 group">
                      <span className="flex items-center justify-center gap-2">
                        Access Platform
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
