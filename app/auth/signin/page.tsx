"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BsEye, BsEyeSlash, BsEnvelope, BsLock } from "react-icons/bs";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import Link from "next/link";
import Image from "next/image";


interface Inputs {
  email: string;
  password: string;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!result?.ok) {
       
        setErrorMessage(result?.error || "Invalid email or password.");
      } else {
        router.push("/dashboard");
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
    
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
            Welcome Back
          </h1>
          <p className=" text-primary">Sign in to your Fariboorz account</p>
        </motion.div>

        <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              Sign In
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
             className="mx-auto mb-3 flex max-w-md items-center gap-2 rounded-lg border border-destructive/30 bg-gradient-red p-3 text-sm text-destructive-foreground shadow-md animate-pulse-red"
              >
                {errorMessage}
              </motion.div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <BsEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-background/50 border-border/50 focus:border-red-600/50 focus:ring-red-600/20 transition-all text-foreground duration-300"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>
            
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <BsLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-red-600/50 focus:ring-red-600/20 transition-all text-foreground duration-300"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <BsEyeSlash className="w-4 h-4" /> : <BsEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>
             
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border/50 text-red-600 focus:ring-red-600/20" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-red-600 hover:text-red-500 transition-colors">
                  Forgot password?
                </Link>
              </motion.div>
          
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
         
            </form>

         
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
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
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center text-sm"
            >
              <span className="text-muted-foreground">Don&apos;t have an account?</span>
              <Link href="/auth/signup" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                Sign up
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignIn;
