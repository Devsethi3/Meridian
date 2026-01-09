"use client";

import { useCallback, useRef, useState, useTransition } from "react";
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
  const [isPending] = useTransition();
  const inFlight = useRef(false);

  const router = useRouter();
  const { user } = useUser();

  const signOut = useCallback(async () => {
    if (inFlight.current) return; // hard guard against double clicks

    if (!user) {
      toast.error("No user is currently signed in");
      return;
    }

    inFlight.current = true;
    setIsLoading(true);
    setError(null);

    const toastId = toast.loading("Signing out…");

    try {
      const { error: signOutError } = await supabase.auth.signOut({
        scope: "local",
      });
      if (signOutError) throw signOutError;

      toast.success("Signed out", {
        id: toastId,
        description: "You have been logged out.",
      });

      // Hard reload the window to clear all client-side state
      window.location.href = "/";
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to sign out";
      setError(message);

      toast.error("Sign out failed", {
        id: toastId,
        description: message,
        action: {
          label: "Try again",
          onClick: () => void signOut(),
        },
      });

      // Useful for debugging
      console.error("Sign out error:", e);
    } finally {
      inFlight.current = false;
      setIsLoading(false);
    }
  }, [router, user]);

  return {
    signOut,
    isLoading: isLoading || isPending,
    error,
  };
};
