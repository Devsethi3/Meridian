"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useSignOut } from "@/hooks/use-sign-out";

const page = () => {
  const { user } = useUser();
  const { signOut, isLoading, error } = useSignOut();

  return (
    <div>
      {user ? "logged in" : "no user"}{" "}
      <Button onClick={signOut}>Log Out</Button>{" "}
    </div>
  );
};

export default page;
