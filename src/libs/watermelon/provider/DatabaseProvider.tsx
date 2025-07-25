import React, { createContext, ReactNode, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

import { Database } from "@nozbe/watermelondb";
import { database } from "../database";
import { runSync } from "../sync";

interface DatabaseContextType {
  database: Database;
  syncData: () => void;
}

export const DatabaseContext = createContext<DatabaseContextType>(
  {} as DatabaseContextType
);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  async function syncData() {
    try {
      await runSync();
      console.log("Sincronização concluída!");
    } catch (error) {
      console.error("Erro na sincronização", error);
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
    <DatabaseContext.Provider value={{ database, syncData }}>
      {children}
    </DatabaseContext.Provider>
  );
}
