import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { CartDetailProfile } from 'common/mapper/cart/cart-detail.profile';
import { CartProfile } from 'common/mapper/cart/cart.profile';
import { OrderDetailProfile } from 'common/mapper/order/order-detail.profile';
import { OrderProfile } from 'common/mapper/order/order.profile';
import { ProductProfile } from 'common/mapper/product/product.profile';
import { UserProfile } from 'common/mapper/user/user.profile';
import { WishlistMappingProfile } from 'common/mapper/wishlist/wishlist-mapping.profile';
import { WishlistProfile } from 'common/mapper/wishlist/wishlist.profile';
import { PostProfile } from './post/post.profile';
import { PostReportProfile } from './post/post-report.profile';
import { CommentProfile } from './comment/comment.profile';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    OrderDetailProfile,
    OrderProfile,
    ProductProfile,
    WishlistProfile,
    WishlistMappingProfile,
    UserProfile,
    CartProfile,
    CartDetailProfile,
    PostProfile,
    PostReportProfile,
    CommentProfile,
  ],
  exports: [AutomapperModule],
})
export class MapperModule {}
