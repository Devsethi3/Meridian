// UserContext.tsx
import { createContext, useContext } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  created_at?: string;
};

type UserContextType = {
  user: UserRow | null;
  setUser: React.Dispatch<React.SetStateAction<UserRow | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
