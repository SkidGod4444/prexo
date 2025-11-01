"use client";
import { useAuthenticatedFetch } from "@/lib/fetch";
import { useUser as useClerkUser } from "@clerk/nextjs";
import {
  useApiKeyStore,
  useMyProfileStore,
  useProjectsStore,
} from "@prexo/store";
import { UserType } from "@prexo/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

interface UserContextType {
  user: UserType | null;
  loading: boolean;
  setUser: (user: UserType | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { myProfile, addMyProfile, removeMyProfile } = useMyProfileStore();
  const { setProjects } = useProjectsStore();
  const { removeKey } = useApiKeyStore();
  const fetchWithAuth = useAuthenticatedFetch();

  // Hooks must be called at the top level, not inside useEffect
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();

  // Use refs to track previous values and prevent duplicate calls
  const prevClerkUserIdRef = useRef<string | undefined>(undefined);
  const fetchingRef = useRef(false);

  // Store latest values in refs to avoid stale closures
  const myProfileRef = useRef(myProfile);
  const fetchWithAuthRef = useRef(fetchWithAuth);

  // Update refs when values change
  useEffect(() => {
    myProfileRef.current = myProfile;
    fetchWithAuthRef.current = fetchWithAuth;
  }, [myProfile, fetchWithAuth]);

  useEffect(() => {
    // Don't run if Clerk isn't loaded yet
    if (!isLoaded) {
      return;
    }

    // Get current Clerk user ID (or undefined if not signed in)
    const currentClerkUserId = clerkUser?.id;

    // If user ID hasn't changed and we're not signed out, skip
    if (prevClerkUserIdRef.current === currentClerkUserId) {
      return;
    }

    // If already fetching, skip
    if (fetchingRef.current) {
      return;
    }

    let isMounted = true;

    async function getData() {
      fetchingRef.current = true;
      setLoading(true);
      try {
        // Check if Clerk user is loaded and signed in
        if (clerkUser && isSignedIn && currentClerkUserId) {
          // Skip if we already have this user's profile in store
          const currentProfile = myProfileRef.current;
          if (currentProfile && currentProfile.id === currentClerkUserId) {
            // Just sync the user state if needed
            setUser(currentProfile);
            prevClerkUserIdRef.current = currentClerkUserId;
            fetchingRef.current = false;
            setLoading(false);
            return;
          }

          const res = await fetchWithAuthRef.current("/user/self");
          if (!res.ok) {
            throw new Error("Failed to fetch user!");
          }
          const data = await res.json();

          if (!isMounted) return;

          setUser(data.user);
          addMyProfile(data.user);
          prevClerkUserIdRef.current = currentClerkUserId;
        } else if (!isSignedIn) {
          // User is signed out - clear state
          if (!isMounted) return;

          setUser(null);
          prevClerkUserIdRef.current = undefined;

          const currentProfile = myProfileRef.current;
          if (currentProfile && currentProfile.id) {
            removeMyProfile(currentProfile.id);
            setProjects([]);
            console.log("Stores cleared!");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        if (isMounted) {
          fetchingRef.current = false;
          setLoading(false);
        }
      }
    }

    getData();

    return () => {
      isMounted = false;
      fetchingRef.current = false;
    };
  }, [
    isLoaded,
    isSignedIn,
    clerkUser?.id,
    addMyProfile,
    removeMyProfile,
    setProjects,
  ]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useMyUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
