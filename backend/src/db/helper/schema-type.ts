import * as schema from '../schema';

export type User = typeof schema.users.$inferSelect;
export type UserInsert = typeof schema.users.$inferInsert;
export type Brand = typeof schema.brands.$inferSelect;
export type Role = typeof schema.roles.$inferSelect;
export type Status = typeof schema.status.$inferSelect;
