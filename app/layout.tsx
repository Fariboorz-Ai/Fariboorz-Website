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
  metadataBase: new URL('https://fariboorzai.com'),

  title: {
    default: 'Fariboorz AI | Free AI Trading Bot & Signals, Crypto Live Performance',
    template: '%s | Fariboorz AI',
  },

  description:
    'Fariboorz AI provides free real-time AI trading Bot &signals for crypto markets. Trade with AI-powered algorithms, transparent live performance tracking, and data-driven strategies built for 2026 traders.',

  keywords: [

    'free trading signals',
    'AI trading bot',
    'crypto signals',
    'forex signals',
    'live trading signals',
    'algorithmic trading',
    'trading performance',

    
    'AI-powered trading signals',
    'machine learning trading bot',
    'automated trading system',
    'quantitative trading AI',
    'smart AI trading algorithms',

    'free crypto trading signals',
    'real-time crypto signals',
    'bitcoin trading signals',
    'altcoin AI signals',
    'crypto futures signals',
    'automated crypto trading bot',

   
    'verified trading performance',
    'live trading results',
    'AI trading bot performance',
    'transparent trading signals',
    'data-driven trading strategies',

    'best free AI trading signals 2026',
    'real-time AI crypto and forex signals',
    'emotion-free AI trading system',
    'institutional-grade trading algorithms'
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },

  openGraph: {
    type: 'website',
    url: 'https://fariboorzai.com',
    title: 'Fariboorz AI – Free AI Trading Bot & Signals & Live Performance',
    description:
      'Access free AI-powered trading Bot & signals for crypto with real-time performance tracking. Built with advanced algorithmic trading technology.',
    images: [
      {
        url: '/Hero-Light.png',
        width: 1200,
        height: 630,
        alt: 'Fariboorz AI Trading Bot & Signals',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Fariboorz AI | Free AI Trading Bot & Signals',
    description:
      'Free real-time AI trading Bot & signals for crypto. Transparent performance. Smart algorithmic trading for 2026.',
    images: ['/Hero-Light.png'],
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