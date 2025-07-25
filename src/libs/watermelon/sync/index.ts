import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../database";
import { pullChanges } from "./pullChanges";
import { pushChanges } from "./pushChanges";

export async function runSync() {
  await synchronize({
    database,
    pullChanges,
    pushChanges,
    migrationsEnabledAtVersion: 1,
  });
}
