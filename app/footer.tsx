import Link from "next/link";
import { Button } from "./components/ui/Button";
import Icon from "./components/Icon";
import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },

      { name: "Documentation", href: "#docs" },
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Status", href: "#status" },
      { name: "Security", href: "#security" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: "mdi:github", href: "#" },
    { name: "Telegram", icon: "mdi:telegram", href: "#" },
    { name: "Twitter", icon: "mdi:twitter", href: "#" },
    { name: "LinkedIn", icon: "mdi:linkedin", href: "#" },
  ];

  return (
    <footer className="relative bg-background border-t border-border/50">
  
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            
         
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                    <Icon icon="tabler:flame-filled" className="text-2xl text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                    Fariboorz
                  </span>
                  <span className="text-xs text-muted-foreground">Advanced Trading Platform</span>
                </div>
              </Link>
              
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">
                Next-generation algorithmic trading platform powered by advanced AI and machine learning. 
                Experience the future of trading with unmatched precision and speed.
              </p>
              
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-10 h-10 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-300 group"
                      asChild
                    >
                      <Link href={social.href} aria-label={social.name}>
                        <Icon 
                          icon={social.icon} 
                          className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors duration-300" 
                        />
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

           

        
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

     
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>


        <div className="border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © {new Date().getFullYear()} Fariborz. All rights reserved.
              </p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Made with ❤️ by Hesam Gh.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
