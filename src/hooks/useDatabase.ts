import { useContext } from "react";
import { DatabaseContext } from "../contexts/DatabaseContext";

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}