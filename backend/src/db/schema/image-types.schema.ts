import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { images } from './images.schema';
import { relations } from 'drizzle-orm';

export const imageTypes = mysqlTable('image_types', {
  id: int().primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const imageTypesToImages = relations(imageTypes, ({ many }) => ({
  images: many(images),
}));
