"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase-client";
import {
  CheckCircle,
  Loader2,
  Brain,
  Star,
  Users,
  Clock,
  Shield,
} from "lucide-react";
import { useState, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";

interface Benefit {
  id: string;
  text: string;
  icon: React.ReactNode;
}

interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const benefits: Benefit[] = [
    {
      id: "1",
      text: "Start hiring in minutes",
      icon: <Clock className="w-4 h-4 text-primary" />,
    },
    {
      id: "2",
      text: "No credit card required",
      icon: <Shield className="w-4 h-4 text-primary" />,
    },
    {
      id: "3",
      text: "14-day free trial",
      icon: <Star className="w-4 h-4 text-primary" />,
    },
    {
      id: "4",
      text: "Cancel anytime",
      icon: <CheckCircle className="w-4 h-4 text-primary" />,
    },
  ];

  const stats: StatItem[] = [
    {
      value: "50K+",
      label: "Companies",
      icon: <Users className="w-6 h-6 text-primary" />,
    },
    {
      value: "99%",
      label: "Accuracy",
      icon: <Star className="w-6 h-6 text-primary" />,
    },
    {
      value: "10x",
      label: "Faster",
      icon: <Clock className="w-6 h-6 text-primary" />,
    },
    {
      value: "24/7",
      label: "Available",
      icon: <Shield className="w-6 h-6 text-primary" />,
    },
  ];

  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
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
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md space-y-6 lg:space-y-8">
            {/* Header */}
            <header className="text-center space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute inset-0 bg-primary rounded-xl blur opacity-20" />
                </div>
                <span className="ml-3 text-2xl font-bold text-foreground">
                  InterviewAI
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Start Your Journey
                </h1>
                <p className="text-muted-foreground">
                  Create your virtual interview with AI in minutes
                </p>
              </div>
            </header>

            {/* Benefits Grid */}
            <section className="space-y-4" aria-label="Benefits">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide text-center">
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {benefit.icon}
                    <span className="text-sm font-medium text-foreground">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Google Sign In Button */}
            <div className="space-y-4">
              <Button
                className="w-full text-base sm:text-lg h-12 sm:h-14 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium"
                variant="outline"
                onClick={loginWithGoogle}
                disabled={isLoading}
                aria-label={
                  isLoading ? "Signing in..." : "Continue with Google"
                }
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
                <span className="ml-2">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <a
                href="/terms"
                className="text-primary hover:underline focus:underline focus:outline-none transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline focus:underline focus:outline-none transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </p>

            {/* Sign In Link */}
            <footer className="text-center pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/sign-in"
                  className="text-primary hover:underline focus:underline focus:outline-none font-medium transition-colors"
                >
                  Sign in
                </a>
              </span>
            </footer>
          </div>
        </div>

        {/* Right Side - Visual Content */}
        <aside className="flex-1 hidden lg:flex items-center justify-center p-8 bg-muted/20">
          <div className="max-w-xl space-y-8">
            {/* Brand Section */}
            <header className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Transform Your Hiring
              </h2>
              <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
                Join the AI recruitment revolution and find the perfect
                candidates faster than ever before.
              </p>
            </header>

            {/* Stats Grid */}
            <section
              className="grid grid-cols-2 gap-6"
              aria-label="Platform Statistics"
            >
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="group text-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="lg:text-2xl text-xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </section>

            {/* Feature Highlights */}
            <section className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  AI-powered candidate screening
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Real-time interview analytics
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Seamless team collaboration
                </span>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SignUpPage;

// Improve the ui and make it better with gradient(shiny) which looks good in light and dark theme both
