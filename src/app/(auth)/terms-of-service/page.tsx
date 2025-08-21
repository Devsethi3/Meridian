"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

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

const TermsOfService = () => {
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
                <span className="text-xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight">
                  Meridian
                </span>
              </Link>

              {/* Theme Toggle and Back Button */}
              <div className="flex items-center gap-2">
                <ThemeToggleButton
                  showLabel
                  variant="circle-blur"
                  start="top-right"
                />

                <Button asChild variant="outline">
                  <Link href="/auth" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>
                </Button>
              </div>

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
                <h1 className="text-4xl sm:text-5xl font-medium bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/40 tracking-tight mb-4">
                  Terms of Service
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  These terms govern your use of Meridian and outline our mutual
                  responsibilities.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </motion.div>

              <div className="space-y-12">
                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    1. Acceptance of Terms
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      By accessing or using Meridian, you agree to be bound by
                      these Terms of Service and our Privacy Policy. If you do
                      not agree to these terms, you may not use our service.
                      These terms apply to all users, including visitors,
                      registered users, and premium subscribers.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    2. Description of Service
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <p className="text-muted-foreground">
                      Meridian is an AI-powered interview preparation platform
                      that provides:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li>
                        • Virtual interview simulations with AI-generated
                        questions
                      </li>
                      <li>• Real-time feedback and performance analytics</li>
                      <li>• Voice interaction through VAPI AI technology</li>
                      <li>
                        • Progress tracking and personalized recommendations
                      </li>
                      <li>
                        • Interview practice across various industries and roles
                      </li>
                    </ul>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    3. User Accounts and Registration
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Account Creation
                      </h3>
                      <p className="text-muted-foreground">
                        You must create an account to use Meridian. You may
                        register using your Google account through our OAuth
                        integration.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Account Security
                      </h3>
                      <p className="text-muted-foreground">
                        You are responsible for maintaining the confidentiality
                        of your account and for all activities that occur under
                        your account. You must notify us immediately of any
                        unauthorized use.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Accurate Information
                      </h3>
                      <p className="text-muted-foreground">
                        You agree to provide accurate, current, and complete
                        information during registration and to update such
                        information as needed.
                      </p>
                    </div>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    4. Acceptable Use Policy
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <p className="text-muted-foreground mb-3">
                      You agree to use Meridian only for lawful purposes. You
                      may not:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li>
                        • Use the service for any illegal or unauthorized
                        purpose
                      </li>
                      <li>
                        • Attempt to gain unauthorized access to our systems
                      </li>
                      <li>
                        • Interfere with or disrupt the service or servers
                      </li>
                      <li>
                        • Upload malicious code or attempt to hack the platform
                      </li>
                      <li>• Share your account credentials with others</li>
                      <li>
                        • Use the service to harass, abuse, or harm others
                      </li>
                      <li>• Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    5. Content and Data
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Your Content
                      </h3>
                      <p className="text-muted-foreground">
                        You retain ownership of any content you submit,
                        including interview responses and recordings. By using
                        our service, you grant us a license to use this content
                        to provide and improve our services.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Our Content
                      </h3>
                      <p className="text-muted-foreground">
                        All content provided by Meridian, including AI-generated
                        questions, feedback, and analytics, remains our
                        intellectual property. You may not reproduce,
                        distribute, or create derivative works without
                        permission.
                      </p>
                    </div>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    6. AI and Voice Processing
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      Our service uses artificial intelligence and voice
                      processing technology. You acknowledge that AI-generated
                      content may not always be accurate and should not be
                      considered professional career advice. Voice data is
                      processed through VAPI AI and is subject to their terms
                      and privacy policies.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    7. Limitation of Liability
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      Meridian is provided "as is" without warranties of any
                      kind. We do not guarantee that the service will be
                      uninterrupted, error-free, or completely secure. To the
                      maximum extent permitted by law, we disclaim all liability
                      for any damages arising from your use of the service.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    8. Service Availability
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      We strive to maintain high availability of our service but
                      cannot guarantee uninterrupted access. We reserve the
                      right to modify, suspend, or discontinue any part of the
                      service at any time with or without notice.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    9. Termination
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        By You
                      </h3>
                      <p className="text-muted-foreground">
                        You may terminate your account at any time by contacting
                        us or using the account deletion feature in the
                        application.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        By Us
                      </h3>
                      <p className="text-muted-foreground">
                        We may terminate or suspend your account if you violate
                        these terms, engage in fraudulent activity, or for any
                        reason at our sole discretion.
                      </p>
                    </div>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    10. Third-Party Services
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      Our service integrates with third-party providers
                      including Google, VAPI AI, and Supabase. Your use of these
                      services is subject to their respective terms and
                      conditions. We are not responsible for the actions or
                      policies of these third parties.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    11. Changes to Terms
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      We reserve the right to modify these terms at any time. We
                      will notify users of material changes by posting the
                      updated terms on this page and updating the "Last updated"
                      date. Your continued use of the service after changes
                      constitutes acceptance of the new terms.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    12. Governing Law
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      These terms are governed by and construed in accordance
                      with applicable laws. Any disputes arising from these
                      terms or your use of the service will be resolved through
                      binding arbitration or in the appropriate courts.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">
                    13. Contact Information
                  </h2>
                  <div className="bg-card/50 rounded-xl p-6 border backdrop-blur-sm">
                    <p className="text-muted-foreground">
                      If you have questions about these Terms of Service, please
                      contact us at legal@meridian-ai.com or through our support
                      channels within the application.
                    </p>
                  </div>
                </motion.section>
              </div>

              <motion.div
                variants={itemVariants}
                className="text-center pt-8 border-t border-border/50"
              >
                <p className="text-sm text-muted-foreground">
                  By using Meridian, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsOfService;
