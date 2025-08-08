import {
  Accuracy,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  removeStorageLocations,
  saveStorageLocation,
} from "../libs/asyncStorage/locationStorage";

export const BACKGROUND_TASK_NAME = "location-tracking";

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
  try {
    if (error) {
      throw error;
    }

    console.log("data", data);

    if (data) {
      const { coords, timestamp } = data.locations[0];

      const currentLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
      };

      console.log("current", currentLocation);

      await saveStorageLocation(currentLocation);
    }
  } catch (error) {
    console.error(error);
    await stopLocationTask();
  }
});

export async function startLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    console.log("starting");

    if (hasStarted) {
      console.log("started");
      await stopLocationTask();
    }

    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true, // para iOS
      foregroundService: {
        notificationTitle: "Rastreamento em andamento",
        notificationBody: "Estamos coletando sua localização em segundo plano.",
        notificationColor: "#000000",
      },
    });

    console.log("started");
  } catch (error) {
    console.error(error);
  }
}

export async function stopLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    console.log("stopping");

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
      await removeStorageLocations();
      console.log("stopped");
    }
  } catch (error) {
    console.error(error);
  }
}
