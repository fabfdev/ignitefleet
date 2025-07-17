import React, { createContext, useContext, ReactNode } from 'react';
import { Database } from '@nozbe/watermelondb';
import { database } from '../database';

interface DatabaseContextType {
  database: Database;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  return (
    <DatabaseContext.Provider value={{ database }}>
      {children}
    </DatabaseContext.Provider>
  );
}
