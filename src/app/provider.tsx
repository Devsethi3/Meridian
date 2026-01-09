// components/UserProvider.tsx (or just Provider.tsx if you prefer)

"use client";

import { UserContext } from "@/context/UserContext";
import { supabase } from "@/supabase/supabase-client";
import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  created_at?: string;
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserRow | null>(null);

  useEffect(() => {
    createNewUser();
  }, []);

  const createNewUser = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const userInfo = authData.user;

    if (!userInfo) return;

    const { data: Users } = await supabase
      .from("Users")
      .select("*")
      .eq("email", userInfo.email);

    if (!Users || Users.length === 0) {
      const { data } = await supabase.from("Users").insert([
        {
          name: userInfo.user_metadata.name,
          email: userInfo.email,
          picture: userInfo.user_metadata?.picture,
        },
      ]);
      if (data) setUser(data[0]);
    } else {
      setUser(Users[0]);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
