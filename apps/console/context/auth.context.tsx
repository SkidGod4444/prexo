"use client";
import { authClient } from "@prexo/auth/client";
import { useApiKeyStore, useMyProfileStore, useProjectsStore } from "@prexo/store";
import { UserType } from "@prexo/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocalStorage } from "usehooks-ts";

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  setUser: (user: UserType | null) => void;
  logout: () => Promise<void>;
}

const landingPage =
  process.env.NODE_ENV === "production"
    ? "https://prexoai.xyz"
    : "http://localhost:3000";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { myProfile, addMyProfile, removeMyProfile } = useMyProfileStore();
  const {setProjects} = useProjectsStore();
  const {removeKey} = useApiKeyStore();
  const [cons, setCons] = useLocalStorage(
    "@prexo-#consoleId",
    '',
  );
  const router = useRouter();

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
            setProjects([])
            removeKey()
            setCons('')
            console.log("consoleId reset!", cons)
            console.log("Stores cleared!");
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
  }, [addMyProfile, myProfile, removeMyProfile, removeKey, setCons, setProjects]);

  // Add logout logic here, inbuilt removeMyProfile
  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      if (myProfile && myProfile.id) {
        removeMyProfile(myProfile.id);
        console.log("User profile removed on logout:", myProfile.id);
      }
      router.push(landingPage);
      console.log("User logged out.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
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
