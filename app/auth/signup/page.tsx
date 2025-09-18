"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BsEye, BsEyeSlash, BsEnvelope, BsLock, BsPerson } from "react-icons/bs";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { signup } from "./actions";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signup({ message: "" }, formData);
      setMessage(result.message);

      if (result.message.includes("success")) {
        window.location.href = "/auth/signin";
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative">
 
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(220,38,38,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.05),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
      
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
               <Image src="/images/ICO.png" alt="Fariboorz" className="text-2xl lg:text-3xl text-white" width={128} height={128} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 blur-xl opacity-50" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
            Join Fariboorz
          </h1>
          <p className="text-primary">Create your account and start trading</p>
        </motion.div>

        <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              Create Account
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Fill in your details to create your account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
         
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <BsPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 bg-background/50 border-border/50 focus:border-red-600/50 focus:ring-red-600/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </motion.div>

       
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <BsEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-background/50 border-border/50 focus:border-red-600/50 focus:ring-red-600/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </motion.div>

           
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <BsLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-red-600/50 focus:ring-red-600/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <BsEyeSlash className="w-4 h-4" /> : <BsEye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

            
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <BsLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-red-600/50 focus:ring-red-600/20 transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <BsEyeSlash className="w-4 h-4" /> : <BsEye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

         
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-start gap-3 text-sm"
              >
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="mt-1 rounded border-border/50 text-red-600 focus:ring-red-600/20"
                  required
                />
                <label htmlFor="terms" className="text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms-privacy" className="text-red-600 hover:text-red-500 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms-privacy" className="text-red-600 hover:text-red-500 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

          
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm ${
                    message.includes("success")
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {message}
                </motion.div>
              )}

 
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

    
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </motion.div>

  
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="text-center text-sm"
            >
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                Sign in
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
