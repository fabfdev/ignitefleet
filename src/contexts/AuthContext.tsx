import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";

export type AuthContextDataProps = {
  initializing: boolean;
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
  const [initializing, setInitiliazing] = useState(true);
  const [user, setUser] = useState();

  function handleAuthStateChanged(user) {
    console.log(user);
    setUser(user);
    setInitiliazing(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
