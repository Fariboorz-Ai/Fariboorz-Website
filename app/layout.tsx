"use client";
import React, { useEffect , useState } from "react";
import "./globals.css";
import AuthProvider from "./auth/AuthProvider";
import { Poppins } from "next/font/google";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<string>("light");
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
    }, []);
  return (
    <html lang="en">
      <body className={`bg-base-100  ${poppins.variable}`}>
        <AuthProvider>
        
          <main className="container mx-auto  min-h-screen overflow-scroll no-scrollbar">
            {children}
          </main>
 
        </AuthProvider>
      </body>
    </html>
  );
}
