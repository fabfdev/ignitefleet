import { Q } from "@nozbe/watermelondb";
import { database } from "../database";

export async function markSyncedRecords(historicIds: string[]) {
  await database.write(async () => {
    const records = await database
      .get("historic")
      .query(Q.where("id", Q.oneOf(historicIds)))
      .fetch();

    for (const record of records) {
      await record.update((rec: any) => {
        rec.isSynced = true;
      });
    }
  });
}
