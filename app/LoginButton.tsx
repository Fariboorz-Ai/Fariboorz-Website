"use client";
import { useSession } from "next-auth/react";
import { FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./components/ui/Button";
export default function LoginButton() {
  const { data: session } = useSession();
  const Username = session?.user?.name;

  return (
   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
         <Link href={session?.user ? "/dashboard" : "/auth/signin"}>
                    <Button className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 group">
                      <span className="relative z-10 flex items-center gap-2">
                        {session?.user ? `Welcome, ${Username}` : "Access Platform"}
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
     </motion.div>
  );
}



 