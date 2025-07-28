import { Q } from "@nozbe/watermelondb";
import { Log } from "../libs/watermelon/models/Log";
import { useDatabase } from "./useDatabase";

export function useLog() {
  const { database } = useDatabase();

  async function getLogByUser(data: { user_id: string }) {
    try {
      const log = await database
        .get<Log>("log")
        .query(Q.where("user_id", data.user_id))
        .fetch();
      return log;
    } catch (error) {
      console.error("Error creating log: ", error);
      throw error;
    }
  }

  async function getLastSyncedTime(data: { user_id: string }) {
    try {
      const log = await database
        .get<Log>("log")
        .query(Q.where("user_id", data.user_id), Q.sortBy("updated_at", Q.desc))
        .fetch();
      return log[0];
    } catch (error) {
      console.error("Error creating log: ", error);
      throw error;
    }
  }

  function observeLastSyncedTime(data: { user_id: string }) {
    return database
      .get<Log>("log")
      .query(Q.where("user_id", data.user_id), Q.sortBy("updated_at", Q.desc));
  }

  return { getLogByUser, getLastSyncedTime, observeLastSyncedTime };
}
