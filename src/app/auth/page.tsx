"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase-client";
import { ArrowLeft, Clock, Loader2, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error.message);
        alert("Failed to sign in with Google. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-[30%] -left-[30%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <Button
          asChild
          variant="outline"
          size="icon"
          className="absolute lg:top-8 lg:left-8 top-5 left-5 z-20"
        >
          <Link href="/" aria-label="Go to home">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>

        {/* Left Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
          <motion.div
            className="w-full max-w-md"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.header
              className="text-center mb-10"
              variants={itemVariants}
            >
              <motion.div
                className="flex justify-center mb-8"
                variants={itemVariants}
              >
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/logo-light.svg"
                      fill
                      alt="logo"
                      className="block dark:hidden"
                    />
                    <Image
                      src="/logo-dark.svg"
                      fill
                      alt="logo"
                      className="dark:block hidden"
                    />
                  </div>
                  <span className="text-2xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight">
                    Meridian
                  </span>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h1 className="text-3xl sm:text-4xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight mb-3">
                  Start Your Journey
                </h1>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Create your virtual interview with AI in minutes
                </p>
              </motion.div>
            </motion.header>

            <motion.div className="space-y-4" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-14 rounded-xl group hover:shadow-md transition-shadow"
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaGoogle className="w-5 h-5" />
                      <span className="ml-3 font-medium">
                        Continue with Google
                      </span>
                    </div>
                  )}
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative rounded-xl border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 cursor-not-allowed opacity-80">
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm border">
                        <Clock className="h-3 w-3" />
                        Coming Soon
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <FaGithub className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-muted-foreground">
                          Continue with GitHub
                        </h3>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                          Create phone interviews with AI
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 text-center text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <p>By continuing, you agree to our Terms and Privacy Policy</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel - Visual */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
          <div className="max-w-md text-center space-y-8 z-10">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm">
                <Clock className="h-4 w-4" />
                <span>Real-time feedback</span>
              </div>
              <h2 className="text-4xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI-Powered Interview Prep
              </h2>
              <p className="text-muted-foreground text-lg">
                Practice with realistic interviews and get instant feedback
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="grid grid-cols-3 gap-4 max-w-xs">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    className="bg-background border rounded-xl aspect-square flex items-center justify-center p-4 shadow-sm"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="bg-muted border rounded-lg w-full h-full" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
