import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const fleetSchema = appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: "historic",
      columns: [
        { name: "user_id", type: "string", isIndexed: true }, // see [https://watermelondb.dev/docs/Schema#indexing]
        { name: "license_plate", type: "string" },
        { name: "description", type: "string" },
        { name: "status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "log",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "location",
      columns: [
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
        { name: "timestamp", type: "number" },
        { name: "historic_id", type: "string", isIndexed: true },
      ],
    }),
  ],
});
