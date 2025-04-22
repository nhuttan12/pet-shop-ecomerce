import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { products } from './products.schema';
import { petTypes } from './pet-types.schema';
export const productsPetMapping = mysqlTable(
  'product_pet_mapping',
  {
    petTypeId: int('pet_type_id')
      .references(() => petTypes.id)
      .notNull(),
    productId: int('product_id')
      .references(() => products.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.petTypeId, t.productId] })],
);
