import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { SyncPullArgs, SyncPullResult } from "@nozbe/watermelondb/sync";
import { getAuth } from "@react-native-firebase/auth";

export async function pullChanges({
  lastPulledAt,
}: SyncPullArgs): Promise<SyncPullResult> {
  const user = getAuth().currentUser;
  const collection = firestore().collection(
    "historic"
  ) as FirebaseFirestoreTypes.CollectionReference;
  const collectionDeleted = firestore().collection(
    "deleted_historic"
  ) as FirebaseFirestoreTypes.CollectionReference;

  // Buscar todos modificados desde o último sync
  const query = lastPulledAt
    ? collection
        .where("updated_at", ">", lastPulledAt)
        .where("user_id", "==", user?.uid)
    : collection.where("user_id", "==", user?.uid);

  // Buscar deletados
  const queryDeleted = collectionDeleted.where("user_id", "==", user?.uid);

  const snapshot = await query.get();
  const snapshotDeleted = await queryDeleted.get();

  const created: any[] = [];
  const updated: any[] = [];
  const deleted: string[] = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    const record = {
      id: doc.id,
      user_id: data.user_id,
      license_plate: data.license_plate,
      description: data.description,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    if (!lastPulledAt || data.created_at > lastPulledAt) {
      created.push(record);
    } else {
      updated.push(record);
    }
  });

  snapshotDeleted.docs.forEach((doc) => {
    const data = doc.data();

    deleted.push(data.id);
  })

  return {
    changes: {
      historic: { created, updated, deleted },
    },
    timestamp: Date.now(),
  };
}
