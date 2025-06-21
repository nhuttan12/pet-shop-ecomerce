import * as schema from '@schema';

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
export type Cart = typeof schema.carts.$inferSelect;
export type CartInsert = typeof schema.carts.$inferInsert;
export type Order = typeof schema.orders.$inferSelect;
export type OrderInsert = typeof schema.orders.$inferInsert;
export type OrderDetail = typeof schema.orderDetails.$inferSelect;
export type OrderDetailInsert = typeof schema.orderDetails.$inferInsert;
export type Product = typeof schema.products.$inferSelect;
export type ProductInsert = typeof schema.products.$inferInsert;
export type ProductImage = typeof schema.productImages.$inferSelect;
export type ProductImageInsert = typeof schema.productImages.$inferInsert;
export type CartDetail = typeof schema.cartDetails.$inferSelect;
export type CartDetailInsert = typeof schema.cartDetails.$inferInsert;
export type Voucher = typeof schema.vouchers.$inferSelect;
export type VoucherInsert = typeof schema.vouchers.$inferInsert;
export type Wishlist = typeof schema.wishlists.$inferSelect;
export type WishlistInsert = typeof schema.wishlists.$inferInsert;
export type Comment = typeof schema.comments.$inferSelect;
export type CommentInsert = typeof schema.comments.$inferInsert;
export type Contact = typeof schema.contacts.$inferSelect;
export type ContactInsert = typeof schema.contacts.$inferInsert;
export type Post = typeof schema.posts.$inferSelect;
export type PostInsert = typeof schema.posts.$inferInsert;
export type CustomerRating = typeof schema.customerRatings.$inferSelect;
export type CustomerRatingInsert = typeof schema.customerRatings.$inferInsert;
export type VoucherMapping = typeof schema.voucherMapping.$inferSelect;
export type VoucherMappingInsert = typeof schema.voucherMapping.$inferInsert;
export type PostEditRequest = typeof schema.postEditRequests.$inferSelect;
export type PostEditRequestInsert = typeof schema.postEditRequests.$inferInsert;
export type PostReport = typeof schema.postReports.$inferSelect;
export type PostReportInsert = typeof schema.postReports.$inferInsert;
