"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { AlertTriangle } from "lucide-react";
import Icon from "@/app/components/Icon";
import Image from "next/image";

export default function TermsPrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative">
     
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(220,38,38,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.05),transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full relative z-10"
      >
        <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl relative overflow-hidden">
  
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-700/10 rounded-full blur-xl"></div>
          
          <CardHeader className="relative z-10 border-b border-border/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <Image src="/images/ICO.png" alt="Fariboorz" className="text-2xl lg:text-3xl text-white" width={64} height={64} />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 blur-xl opacity-50" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <CardTitle className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Terms of Service & Privacy Policy
              </CardTitle>
              <p className="text-center text-muted-foreground">Effective Date: September 18, 2025</p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-10 text-base leading-relaxed py-8 relative z-10">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-xl border border-border/50 shadow-sm hover:border-red-600/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Icon icon="lucide:alert-triangle" className="text-3xl h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Terms of Service</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Welcome to Fariboorz AI. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Eligibility:</span> You must be at least 18 years old to use our services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Account Responsibility:</span> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Prohibited Activities:</span> You agree not to use our services for any unlawful, fraudulent, or abusive purpose.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Intellectual Property:</span> All content, trademarks, and technology on this site are the property of Fariboorz AI and may not be used without permission.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Disclaimer:</span> Fariboorz AI provides trading signals and automation tools for informational purposes only. We do not guarantee profits or accept liability for trading losses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Termination:</span> We reserve the right to suspend or terminate your account at our discretion for violations of these terms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Changes:</span> We may update these terms at any time. Continued use of our services constitutes acceptance of the revised terms.</span>
                </li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-xl border border-border/50 shadow-sm hover:border-red-600/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Icon icon="lucide:shield" className="text-2xl text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Privacy Policy</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Fariboorz AI is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Information Collection:</span> We collect information you provide during registration, such as your name, email, and exchange API keys. We also collect usage data and analytics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Use of Information:</span> Your information is used to provide and improve our services, personalize your experience, and communicate important updates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Data Security:</span> We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or alteration.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Third-Party Services:</span> We may use third-party providers (e.g., exchanges, Telegram) to facilitate certain features. Your data is shared only as necessary and in accordance with this policy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Cookies:</span> Our site uses cookies to enhance user experience and analyze site traffic. You may disable cookies in your browser settings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Data Retention:</span> We retain your information as long as your account is active or as required by law.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Your Rights:</span> You may access, update, or delete your personal information by contacting <a href="mailto:support@fariboorz-ai.com" className="text-red-600 underline hover:text-red-500 transition-colors">support@fariboorz-ai.com</a>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 mt-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
                  <span className="text-foreground"><span className="font-semibold text-foreground">Policy Updates:</span> We may update this policy periodically. Changes will be posted on this page.</span>
                </li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-xl border border-border/50 shadow-sm text-center hover:border-red-600/30 transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <Icon icon="lucide:mail" className="text-3xl h-6 w-6 text-red-600" />
              
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service or our Privacy Policy, please contact us at <a href="mailto:support@fariboorz-ai.com" className="text-red-600 underline hover:text-red-500 transition-colors">support@fariboorz-ai.com</a>.
              </p>
            </motion.section>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}