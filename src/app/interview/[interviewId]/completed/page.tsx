"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Home,
  Star,
  Timer,
  User,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

const CompletedInterviewPage = () => {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full bg-background rounded-2xl shadow-lg overflow-hidden border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 sm:p-8">
          {/* Animated Checkmark */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="relative"
            >
              {/* Circle background */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  delay: 0.1,
                }}
                className="absolute inset-0 dark:bg-white bg-black rounded-full"
              />

              {/* Animated checkmark */}
              <motion.svg
                className="w-20 h-20 relative z-10 dark:text-emerald-500 text-emerald-300"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M20,50 L40,70 L80,30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                />
              </motion.svg>
            </motion.div>
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Interview Completed!
            </h1>
            <p className="text-muted-foreground">
              Great job completing the interview. Your feedback report is ready.
            </p>
          </motion.div>

          {/* Feedback Summary */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-primary/5 border border-border rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Feedback Summary
              </h2>
            </div>

            <motion.p className="text-muted-foreground" variants={itemVariants}>
              Nice work—your responses were recorded successfully. We&apos;ve
              saved your feedback and you can review it anytime.
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="flex-1 py-6"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-6"
            >
              View Full Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 px-6 py-4 text-center text-sm text-muted-foreground border-t">
          Thank you for using our interview platform
        </div>
      </motion.div>
    </div>
  );
};

// Reusable summary item component
const SummaryItem = ({
  icon,
  label,
  value,
  highlight,
  variants,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  variants?: any;
}) => (
  <motion.div
    className={`bg-background rounded-lg border p-4 ${
      highlight ? "border-primary/30" : "border-border"
    }`}
    variants={variants}
  >
    <div className="flex items-center gap-3 mb-2">
      <div
        className={`p-2 rounded-md ${
          highlight
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div
        className={`text-sm ${
          highlight ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
    </div>
    <div
      className={`text-base font-medium ${
        highlight ? "text-primary" : "text-foreground"
      }`}
    >
      {value}
    </div>
  </motion.div>
);

export default CompletedInterviewPage;
