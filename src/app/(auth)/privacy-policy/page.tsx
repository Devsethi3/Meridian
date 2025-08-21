"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-[30%] -left-[30%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
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
                <span className="text-xl  bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight">
                  Meridian
                </span>
              </Link>

              <Button asChild variant="outline" size="sm">
                <Link href="/auth" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl  bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight mb-4">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Learn how we collect, use, and protect your information when
                  you use Meridian.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </motion.div>

              <div className="space-y-12">
                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    1. Information We Collect
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <div>
                      <h3 className="text-lg  text-foreground mb-2">
                        Personal Information
                      </h3>
                      <p className="text-muted-foreground">
                        When you create an account with Meridian, we collect
                        information such as your name, email address, and
                        profile picture through your Google account
                        authentication.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg  text-foreground mb-2">
                        Interview Data
                      </h3>
                      <p className="text-muted-foreground">
                        We collect and store your interview responses, including
                        audio recordings, text transcriptions, and performance
                        analytics to provide you with personalized feedback and
                        track your progress.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg  text-foreground mb-2">
                        Usage Information
                      </h3>
                      <p className="text-muted-foreground">
                        We collect information about how you use our service,
                        including session duration, features accessed, and
                        interaction patterns to improve our platform.
                      </p>
                    </div>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    2. How We Use Your Information
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                        <span>
                          Provide and maintain our AI interview preparation
                          service
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                        <span>
                          Generate personalized feedback and recommendations
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                        <span>
                          Analyze your interview performance and track progress
                          over time
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                        <span>Improve our AI models and service quality</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                        <span>
                          Communicate with you about service updates and support
                        </span>
                      </li>
                    </ul>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    3. Information Sharing and Disclosure
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <p className="text-muted-foreground">
                      We do not sell, trade, or rent your personal information
                      to third parties. We may share your information in the
                      following limited circumstances:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li>
                        • With AI service providers (VAPI AI) to process
                        interview interactions
                      </li>
                      <li>
                        • With cloud infrastructure providers (Supabase) for
                        data storage and authentication
                      </li>
                      <li>
                        • When required by law or to protect our legal rights
                      </li>
                      <li>
                        • In case of a business transaction such as a merger or
                        acquisition
                      </li>
                    </ul>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    4. Data Security
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      We implement industry-standard security measures to
                      protect your personal information, including encryption in
                      transit and at rest, secure authentication protocols, and
                      regular security audits. However, no method of
                      transmission over the internet is 100% secure, and we
                      cannot guarantee absolute security.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    5. Data Retention
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      We retain your personal information for as long as
                      necessary to provide our services and fulfill the purposes
                      outlined in this Privacy Policy. Interview data and
                      recordings are kept to track your progress and improve our
                      AI models. You may request deletion of your data at any
                      time by contacting us.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    6. Your Rights
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground mb-3">
                      You have the following rights regarding your personal
                      information:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li>• Access and review your personal data</li>
                      <li>• Correct inaccurate or incomplete information</li>
                      <li>• Delete your account and associated data</li>
                      <li>• Export your data in a portable format</li>
                      <li>• Opt-out of certain data processing activities</li>
                    </ul>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    7. Third-Party Services
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      Our service integrates with third-party providers
                      including Google (for authentication), VAPI AI (for voice
                      processing), and Supabase (for data storage). These
                      services have their own privacy policies that govern the
                      use of your information on their platforms.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    8. Changes to This Policy
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy from time to time to
                      reflect changes in our practices or for other operational,
                      legal, or regulatory reasons. We will notify you of any
                      material changes by posting the new Privacy Policy on this
                      page and updating the "Last updated" date.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40">
                    9. Contact Us
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      If you have any questions about this Privacy Policy or our
                      data practices, please contact us at
                      privacy@meridian-ai.com or through our support channels
                      within the application.
                    </p>
                  </div>
                </motion.section>
              </div>

              <motion.div
                variants={itemVariants}
                className="text-center pt-8 border-t border-border/50"
              >
                <p className="text-sm text-muted-foreground">
                  This privacy policy is effective as of the date listed above
                  and applies to all users of the Meridian platform.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
