import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const fleetSchema = appSchema({
  version: 3,
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
  ],
});
