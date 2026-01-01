"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  BsRocket, 
  BsShieldLock, 
  BsLightningCharge, 
  BsGraphUp, 
  BsGlobe, 
  BsCpu,
  BsArrowRight,
} from "react-icons/bs";
import Header from "./header";
import Footer from "./footer";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import Icon from "@/app/components/Icon";
import FloatingActionButton from "@/app/components/FloatingActionButton";
import { NotificationContainer } from "@/app/components/Notification";
import CookieConsent from "@/app/components/CookieConsent";


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { value: "0.37ms", label: "Avg. Execution", icon: "bi:lightning-charge", color: "text-red-500" },
    { value: "99.99%", label: "Uptime", icon: "bi:shield-lock", color: "text-green-500" },
    { value: "24/7", label: "Monitoring", icon: "bi:rocket", color: "text-red-600" },
    { value: "50M+", label: "Trades/Day", icon: "bi:graph-up", color: "text-red-700" },
  ];

  const features = [
    {
      icon: 'bi:cpu',
      title: "Advanced AI Engine",
      description: "Next-generation algorithms powered by advanced AI for unprecedented trading accuracy",
      gradient: "from-red-600 to-red-700"
    },
    {
      icon: "bi:shield-lock",
      title: "Military Security",
      description: "Multi-layer encryption with cold wallet integration and real-time threat detection",
      gradient: "from-red-700 to-red-800"
    },
    {
      icon: "bi:lightning-charge",
      title: "Real-Time Execution",
      description: "Lightning-fast trade execution engine with sub-millisecond latency",
      gradient: "from-red-600 to-red-700"
    },
    {
      icon: "bi:globe",
      title: "Global Markets",
      description: "Access to 100+ global markets with advanced liquidity aggregation",
      gradient: "from-red-700 to-red-800"
    },
    {
      icon: "bi:graph-up",
      title: "AI Analytics",
      description: "Advanced AI-powered market analysis and predictive modeling",
      gradient: "from-red-600 to-red-700"
    },
    {
      icon: "bi:rocket",
      title: "Auto Scaling",
      description: "Intelligent portfolio management with dynamic risk adjustment",
      gradient: "from-red-700 to-red-800"
    }
  ];

  return (
    <>
      <Header />
      
      <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-hidden">
        
    
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-red-500/5 to-red-700/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
             
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-sm font-medium mb-6"
                >
                  <Icon icon="tabler:flame-filled" className="w-4 h-4" />
                  <span>Advanced Trading Platform</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                    Advanced
                  </span>
                  <br />
                  <span className="text-foreground">Trading Intelligence</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-muted-foreground mb-8 leading-relaxed"
                >
                  Harness the power of advanced AI algorithms and real-time market execution. 
                  Experience trading at the speed of light with unmatched precision.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Button className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300 group">
                    <Link href="/auth/signup" className="relative z-10 flex items-center gap-2">
                      Start Now
                      <Icon icon="bi:arrow-right" className="group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                  
                </motion.div>

           
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 hover:border-red-600/30 transition-all duration-300 group"
                    >
                      <Icon icon={stat.icon} className={`text-2xl mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

             
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <div className="relative">
                
                  <div className="relative bg-gradient-to-br from-red-600/20 via-red-500/20 to-red-700/20 rounded-3xl p-1 shadow-2xl">
                    <div className="bg-background/80 backdrop-blur-xl rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                      <Image
                       src="/images/Hero-Light.png"
                       className="relative z-10 w-full h-auto rounded-2xl"
                        width={500}
                        height={500}
                        alt="Fariboorz AI Light"
                       />
                   
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

       
     
        <section id="features" className="py-24 bg-gradient-to-br from-red-600/5 via-red-500/5 to-red-700/5  relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Revolutionary
                </span> Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the future of trading with our cutting-edge technology stack
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="bg-card/50 backdrop-blur-xl border border-border/50 hover:border-red-600/30 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon icon={feature.icon} className="text-2xl text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <FloatingActionButton />
      <NotificationContainer />
      <CookieConsent />
      <Footer />
    </>
  );
}

