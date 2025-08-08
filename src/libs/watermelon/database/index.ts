import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { fleetSchema } from "../schemas/schema";
import { Historic } from "../models/Historic";
import { migrations } from "../migrations/migrations";
import { Log } from "../models/Log";
import { Location } from "../models/Location";

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: fleetSchema,
  // (optional database name or file system path)
  migrations: migrations,
  dbName: "ignitefleet",
  jsi: true,
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error("Database setup error:", error);
  },
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [Historic, Log, Location],
});
