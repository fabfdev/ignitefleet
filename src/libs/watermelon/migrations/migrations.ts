import { schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        // Exemplo: add coluna nova
        // addColumns({ table: 'historic', columns: [{ name: 'new_column', type: 'string' }] })
      ],
    },
  ],
});
