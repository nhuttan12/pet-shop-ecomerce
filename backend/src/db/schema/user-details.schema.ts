import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';
import { images } from './images.schema';
import { relations } from 'drizzle-orm';

export const userDetails = mysqlTable('user_details', {
  id: int()
    .notNull()
    .primaryKey()
    .references(() => users.id),
  phone: varchar('phone', { length: 10 }).unique(),
  adresss: varchar('adresss', { length: 255 }),
  imageId: int('image_id')
    .notNull()
    .references(() => images.id),
});

export const usersDetailToImage = relations(userDetails, ({ many }) => ({
  images: many(images),
}));
