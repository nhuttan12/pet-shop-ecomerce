import * as schema from '../schema';

/**
 * @description: type for schema to return when create function
 * @var User: return type for user selection information
 * @var UserInsert: return type for user insert information
 * @var Brand: return type for brand selection information
 * @var Role: return type for role selection information
 * @var Status: return type for status selection information
 */
export type User = typeof schema.users.$inferSelect;
export type UserInsert = typeof schema.users.$inferInsert;
export type Brand = typeof schema.brands.$inferSelect;
export type BrandInsert = typeof schema.brands.$inferInsert;
export type Role = typeof schema.roles.$inferSelect;
export type ImageInsert = typeof schema.images.$inferInsert;
export type Image = typeof schema.images.$inferSelect;
export type UserDetail = typeof schema.userDetails.$inferSelect;
export type Category = typeof schema.categories.$inferSelect;
export type CategoryInsert = typeof schema.categories.$inferInsert;
