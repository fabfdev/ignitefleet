import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "@react-native-firebase/auth";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export type AuthContextDataProps = {
  initializing: boolean;
  user: FirebaseAuthTypes.User | null;
  signOut: () => void;
};

type AuthContextProviderProps = {
  fallback:
    | React.ComponentType<unknown>
    | React.ReactElement
    | null
    | undefined;
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({
  fallback: Fallback,
  children,
}: AuthContextProviderProps) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      console.log("Auth state changed: User signed in -", user);
    } else {
      console.log("Auth state changed: User signed out");
    }
    setUser(user);
    setInitializing(false);
  }

  async function signOut() {
    try {
      console.log('Starting sign out process...');
      
      // First sign out from Google
      await GoogleSignin.signOut();
      console.log('Google sign out successful');
      
      // Then sign out from Firebase Auth
      const auth = getAuth();
      await firebaseSignOut(auth);
      console.log('Firebase sign out successful');
      
    } catch (error) {
      console.error('Sign out error:', error instanceof Error ? error.message : String(error));
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    if (typeof Fallback === "function") {
      return <Fallback />;
    }
    return <>{Fallback}</>;
  }

  return (
    <AuthContext.Provider
      value={{
        initializing,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
