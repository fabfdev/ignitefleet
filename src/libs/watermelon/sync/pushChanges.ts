import firestore from "@react-native-firebase/firestore";
import { SyncPushArgs } from "@nozbe/watermelondb/sync";

export async function pushChanges({ changes }: SyncPushArgs) {
  const historicChanges = (changes as any).historic;

  if (!historicChanges) return;

  const batch = firestore().batch();
  const collection = firestore().collection("historic");

  historicChanges.created.forEach((record: any) => {
    const ref = collection.doc(record.id);
    batch.set(ref, {
      ...record,
      updated_at: Date.now(),
    });
  });

  historicChanges.updated.forEach((record: any) => {
    const ref = collection.doc(record.id);
    batch.update(ref, {
      ...record,
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
}
