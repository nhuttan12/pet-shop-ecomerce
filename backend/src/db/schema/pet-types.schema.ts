import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { status } from './status.schema';
import { timestamps } from '../helper/timestamp';
import { productsPetMapping } from './product-pet-mapping.schema';
import { relations } from 'drizzle-orm';

export const petTypes = mysqlTable('pet_types', {
  id: int().primaryKey().notNull().autoincrement(),
  name: varchar('name', { length: 45 }),
  statusId: int('status_id')
    .references(() => status.id)
    .notNull(),
  ...timestamps,
});

export const petTypesToProductPetMappinng = relations(petTypes, ({ many }) => ({
  productsPetMapping: many(productsPetMapping),
}));
