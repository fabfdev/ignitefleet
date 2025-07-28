import React, { createContext, ReactNode, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

import { Database } from "@nozbe/watermelondb";
import { database } from "../libs/watermelon/database";
import { runSync } from "../libs/watermelon/sync";

import { useAuth } from "../hooks/useAuth";

interface DatabaseContextType {
  database: Database;
  isSyncing: boolean;
  syncData: () => Promise<void>;
}

export const DatabaseContext = createContext<DatabaseContextType>(
  {} as DatabaseContextType
);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseContextProvider({ children }: DatabaseProviderProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const { user } = useAuth();

  async function syncData() {
    if (!user?.uid) return;
    try {
      setIsSyncing(true);
      await runSync();
      console.log("Sincronização concluída!");
    } catch (error) {
      console.error("Erro na sincronização", error);
    } finally {
      setIsSyncing(false);
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !isSyncing) {
        syncData();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <DatabaseContext.Provider value={{ database, isSyncing, syncData }}>
      {children}
    </DatabaseContext.Provider>
  );
}
