"use client";
import { authClient } from "@prexo/auth/client";
import { useMyProfileStore } from "@prexo/store";
import { UserType } from "@prexo/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  setUser: (user: UserType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { myProfile, addMyProfile, removeMyProfile } = useMyProfileStore();

  useEffect(() => {
    let isMounted = true;
    async function getData() {
      setLoading(true);
      try {
        const session = await authClient.getSession();
        // Defensive: ensure session.data and session.data.user are defined
        const sessionUser = session?.data?.user ?? null;
        if (sessionUser) {
          setUser(sessionUser);
          // Defensive: ensure myProfile is defined and has id
          if (myProfile && myProfile.id === sessionUser.id) {
            return;
          }
          addMyProfile(sessionUser);
          console.log("User fetched:", sessionUser);
        } else {
          setUser(null);
          if (myProfile && myProfile.id) {
            removeMyProfile(myProfile.id);
            console.log("User profile removed:", myProfile.id);
          }
          console.log("No user found in session.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    getData();
    return () => {
      isMounted = false;
    };
  }, [addMyProfile, myProfile, removeMyProfile]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the user context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
