import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "./auth/AuthProvider";
import ThemeProvider from "./components/ThemeProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});


export const metadata = {
  title: {
    default: "Fariboorz - Advanced Trading Platform",
    template: "%s | Fariboorz",
  },
  description:
    "Experience the future of trading with advanced AI algorithms and real-time execution. Join thousands of traders who have transformed their trading with Fariboorz.",
  keywords:
    "trading, AI, algorithmic trading, cryptocurrency, automated trading, trading bot, portfolio analytics",
 
  twitter: {
    site: "@fariboorz-ai",
    creator: "@fariboorz-ai",
    title: "Fariboorz - Advanced Trading Platform",
    description:
      "Experience the future of trading with advanced AI algorithms and real-time execution.",
    images: ["/images/favicon.ico"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico" }, 
    ],
    apple: [{ url: "/images/favicon.ico", sizes: "180x180" }],
  },
  manifest: "/images/site.webmanifest", 
  alternates: {
    canonical: "https://fariboorz-ai.com",
    languages: {
      "en-US": "https://fariboorz-ai.com/en",
      "fa-IR": "https://fariboorz-ai.com/fa",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {  
  return (
    <html lang="en">
      <body className={`bg-base-100 ${poppins.variable}`}>
        <AuthProvider>
          <ThemeProvider>
            <main className=" min-h-screen overflow-scroll no-scrollbar">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}