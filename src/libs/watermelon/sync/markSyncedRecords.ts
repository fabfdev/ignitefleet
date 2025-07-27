import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import { Log } from "../models/Log";
import { getAuth } from "@react-native-firebase/auth";

export async function markSyncedRecords() {
  const userId = getAuth().currentUser?.uid;
  if (!userId) return;
  //historicIds: string[]
  // await database.write(async () => {
  //   const records = await database
  //     .get("historic")
  //     .query(Q.where("id", Q.oneOf(historicIds)))
  //     .fetch();

  //   for (const record of records) {
  //     await record.update((rec: any) => {
  //       rec.isSynced = true;
  //     });
  //   }
  // });

  await database.write(async () => {
    return database.get<Log>("log").create((log) => {
      log.user_id = userId!;
      log.updated_at = new Date();
    });
  });
}
