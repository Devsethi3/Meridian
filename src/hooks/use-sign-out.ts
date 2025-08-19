"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/supabase/supabase-client";
import { useUser } from "@/context/UserContext";

interface UseSignOutReturn {
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useSignOut = (): UseSignOutReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const signOut = useCallback(async () => {
    // Prevent multiple simultaneous sign out attempts
    if (isLoading) return;

    // Check if user is actually signed in
    if (!user) {
      toast.error("No user is currently signed in");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Signing out...");

      const { error: signOutError } = await supabase.auth.signOut();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (signOutError) {
        throw signOutError;
      }

      // Success toast
      toast.success("Successfully signed out", {
        description: "You have been logged out of your account",
      });

      // Optional: Redirect to login or home page
      router.push("/login"); // Adjust path as needed
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign out";

      setError(errorMessage);

      // Error toast
      toast.error("Sign out failed", {
        description: errorMessage,
        action: {
          label: "Try again",
          onClick: () => signOut(),
        },
      });

      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, user, router]);

  return {
    signOut,
    isLoading,
    error,
  };
};
