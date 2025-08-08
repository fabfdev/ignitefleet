import firestore from "@react-native-firebase/firestore";
import { SyncPushArgs } from "@nozbe/watermelondb/sync";
import { markSyncedRecords } from "./markSyncedRecords";

export async function pushChanges({ changes }: SyncPushArgs) {
  const historicChanges = (changes as any).historic;
  const locationChanges = (changes as any).location;

  if (!historicChanges) return;
  if (!locationChanges) return;

  const batch = firestore().batch();
  const collection = firestore().collection("historic");

  historicChanges.created.forEach((record: any) => {
    const locations = locationChanges.created.filter(
      (item: any) => item.historic_id === record.id
    );
    const ref = collection.doc(record.id);
    batch.set(ref, {
      ...record,
      locations,
      updated_at: Date.now(),
    });
  });

  historicChanges.updated.forEach((record: any) => {
    const locations = locationChanges.updated.filter(
      (item: any) => item.historic_id === record.id
    );
    const ref = collection.doc(record.id);
    batch.update(ref, {
      ...record,
      locations,
      updated_at: Date.now(),
    });
  });

  historicChanges.deleted.forEach((id: string) => {
    const ref = collection.doc(id);
    batch.update(ref, {
      deleted: true,
      updated_at: Date.now(),
    });
  });

  await batch.commit();

  await markSyncedRecords();
}
