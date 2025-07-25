import React, { createContext, ReactNode, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

import { Database } from "@nozbe/watermelondb";
import { database } from "../libs/watermelon/database";
import { runSync } from "../libs/watermelon/sync";

interface DatabaseContextType {
  database: Database;
  isSyncing: boolean;
  syncData: () => void;
}

export const DatabaseContext = createContext<DatabaseContextType>(
  {} as DatabaseContextType
);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseContextProvider({ children }: DatabaseProviderProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  async function syncData() {
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
      if (state.isConnected) {
        runSync();
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
