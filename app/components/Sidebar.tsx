"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname , redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/utils";
import Icon from "./Icon";
import Image from "next/image";
import { getSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "mdi:view-dashboard" },
  { href: "/dashboard/trades", label: "Trades History", icon: "mdi:history" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "mdi:bell" },
  { href: "/dashboard/setting", label: "Settings", icon: "mdi:cog" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const Logout = async () => {
    try {
      setIsOpen(false);
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (error) {
      console.error('Error signing out:', error);

      redirect('/auth/signin');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed md:hidden z-50 top-4 right-4 p-2 bg-background/80 backdrop-blur rounded-lg border shadow-lg text-foreground"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <Icon icon="mdi:close" className="w-6 h-6" /> : <Icon icon="mdi:menu" className="w-6 h-6" />}
      </button>

      <motion.aside
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: isOpen ? 0 : isMobile ? -300 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl text-foreground",
          "md:translate-x-0 z-[60]"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-border">
           <Image src="/images/ICO.png" alt="Fariboorz" className="text-2xl lg:text-3xl text-white" width={64} height={64} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            Dashbaord
          </h1>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                "hover:bg-red-600/10 hover:text-red-700 focus:bg-red-600/10 focus:text-red-700",
                pathname === item.href
                  ? "bg-red-600/10 text-red-700 font-semibold"
                  : "text-foreground"
              )}
            >
              <Icon icon={item.icon} className={cn("w-5 h-5", pathname === item.href ? "text-red-700" : "text-foreground")} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={() => {
              Logout();
            }}
            className="flex items-center gap-3 p-3 rounded-xl transition-all w-full hover:bg-red-600/10 hover:text-red-700 text-foreground"
          >
            <Icon icon="mdi:logout" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {isOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}