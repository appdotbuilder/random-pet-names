
import { serial, text, pgTable, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define pet type enum
export const petTypeEnum = pgEnum('pet_type', ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other']);

export const petNamesTable = pgTable('pet_names', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: petTypeEnum('type').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type PetName = typeof petNamesTable.$inferSelect;
export type NewPetName = typeof petNamesTable.$inferInsert;

// Export all tables for proper query building
export const tables = { petNames: petNamesTable };
