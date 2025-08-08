import {
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        // Exemplo: add coluna nova
        // addColumns({ table: 'historic', columns: [{ name: 'new_column', type: 'string' }] })
      ],
    },
    {
      toVersion: 3,
      steps: [
        createTable({
          name: "log",
          columns: [
            { name: "user_id", type: "string", isIndexed: true },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        createTable({
          name: "location",
          columns: [
            { name: "latitude", type: "number" },
            { name: "longitude", type: "number" },
            { name: "timestamp", type: "number" },
            { name: "historic_id", type: "string", isIndexed: true },
          ],
        }),
      ],
    },
  ],
});
