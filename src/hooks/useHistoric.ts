import { useDatabase } from '../libs/watermelon/provider/DatabaseProvider';
import { Historic } from '../libs/watermelon/models/Historic';
import { Q } from '@nozbe/watermelondb';

export function useHistoric() {
  const { database } = useDatabase();

  async function createHistoric(data: {
    user_id: string;
    license_plate: string;
    description: string;
    status: string;
  }) {
    try {
      const historic = await database.write(async () => {
        return await database.get<Historic>('historic').create((historic) => {
          historic.user_id = data.user_id;
          historic.license_plate = data.license_plate;
          historic.description = data.description;
          historic.status = data.status;
        });
      });
      return historic;
    } catch (error) {
      console.error('Error creating historic:', error);
      throw error;
    }
  }

  async function getHistoricByUser(userId: string) {
    try {
      const historic = await database
        .get<Historic>('historic')
        .query(Q.where('user_id', userId))
        .fetch();
      return historic;
    } catch (error) {
      console.error('Error getting historic:', error);
      throw error;
    }
  }

  async function updateHistoric(id: string, data: Partial<{
    license_plate: string;
    description: string;
    status: string;
  }>) {
    try {
      const historic = await database.get<Historic>('historic').find(id);
      const updatedHistoric = await database.write(async () => {
        return await historic.update((historic) => {
          if (data.license_plate) historic.license_plate = data.license_plate;
          if (data.description) historic.description = data.description;
          if (data.status) historic.status = data.status;
        });
      });
      return updatedHistoric;
    } catch (error) {
      console.error('Error updating historic:', error);
      throw error;
    }
  }

  async function deleteHistoric(id: string) {
    try {
      const historic = await database.get<Historic>('historic').find(id);
      await database.write(async () => {
        await historic.destroyPermanently();
      });
    } catch (error) {
      console.error('Error deleting historic:', error);
      throw error;
    }
  }

  return {
    createHistoric,
    getHistoricByUser,
    updateHistoric,
    deleteHistoric,
  };
}
