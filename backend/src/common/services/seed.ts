import { Brand } from '@brand/entities/brands.entity';
import { BrandStatus } from '@brand/enums/brand-status.enum';
import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { Category } from '@category/entities/categories.entity';
import { CategoryStatus } from '@category/enums/categories-status.enum';
import { Image } from '@images/entites/images.entity';
import { ImageStatus } from '@images/enums/image-status.enum';
import { ImageType } from '@images/enums/image-type.enum';
import { SubjectType } from '@images/enums/subject-type.enum';
import { Product } from '@product/entites/products.entity';
import { ProductStatus } from '@product/enums/product-status.enum';
import { Role } from '@role/entities/roles.entity';
import { RoleStatus } from '@role/enums/role-status.enum';
import { RoleName } from '@role/enums/role.enum';
import { User } from '@user/entites/users.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import bcrypt from 'bcrypt';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import { CsvProduct } from './interfaces/csvProduct.interface';
import { UserDetail } from '@user/entites/user-details.entity';
import { Cart } from '@cart/entities/carts.entity';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { Voucher } from '@voucher/entities/vouchers.entity';
import { VoucherMapping } from '@voucher/entities/voucher-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import { PostReport } from '@post/entities/post-report.entity';
import { PostEditRequest } from '@post/entities/post-edit-request.entity';
import { Order } from '@order/entites/orders.entity';
import { OrderDetail } from '@order/entites/order-details.entity';
import { Comment } from '@comment/entities/comments.entity';
import { ProductRating } from '@product/entites/product-rating.entity';
import { Contact } from '@contact/entites/contacts.entity';
import { Post } from '@post/entities/posts.entity';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import { Logger } from '@nestjs/common';

const logger = new Logger('SeedService');
const parsePrice = (price: string): number =>
  parseInt(price.replace(/[^\d]/g, ''));

export async function main() {
  try {
    const saltOrRounds = 10;

    // Tạo kết nối đến DB
    const dataSource = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'pet-shop',
      synchronize: false,
      logging: true,
      logger: 'debug',
      entities: [
        User,
        Post,
        Role,
        Product,
        Brand,
        Category,
        CategoryMapping,
        Image,
        UserDetail,
        Cart,
        CartDetail,
        Voucher,
        VoucherMapping,
        Wishlist,
        WishlistMapping,
        PostReport,
        PostEditRequest,
        Order,
        OrderDetail,
        Comment,
        ProductRating,
        Contact,
      ],
    });

    await dataSource.initialize();
    logger.debug(
      '✅ Loaded entities:',
      dataSource.entityMetadatas.map((e) => e.name),
    );

    const csvFilePath = path.resolve(process.cwd(), 'products.csv');
    const records: CsvProduct[] = [];

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => records.push(row as CsvProduct))
        .on('end', () => resolve())
        .on('error', reject);
    });

    // insert data from csv to db
    await dataSource.transaction(async (manager) => {
      // Chèn dữ liệu mẫu
      const roles: Role[] = await manager.save(Role, [
        { id: 1, name: RoleName.ADMIN, status: RoleStatus.ACTIVE },
        { id: 2, name: RoleName.CUSTOMER, status: RoleStatus.ACTIVE },
        { id: 3, name: RoleName.CUSTOMER, status: RoleStatus.ACTIVE },
        { id: 4, name: RoleName.MANAGER, status: RoleStatus.ACTIVE },
        { id: 5, name: RoleName.MARKETING_EMPLOYEE, status: RoleStatus.ACTIVE },
        { id: 6, name: RoleName.SALE_EMPLOYEE, status: RoleStatus.ACTIVE },
      ]);
      logger.debug('✅ Inserted roles', roles);

      const image: Image = await manager.save(Image, {
        id: 1,
        url: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1747916657/pngegg_1_elsdfw.png',
        type: ImageType.AVATAR,
        folder: 'tmdt-ck',
        status: ImageStatus.ACTIVE,
        subjectType: SubjectType.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.debug('✅ Inserted image', image);

      try {
        const user: User = await manager.save(User, {
          email: 'admin@gmail.com',
          username: 'admin',
          password: await bcrypt.hash('123123', saltOrRounds),
          status: UserStatus.ACTIVE,
          role: { id: 1 },
        });
        logger.debug('✅ Inserted user', user);
      } catch (error) {
        logger.error(error);
        throw error;
      }

      for (const row of records) {
        const brandName = row['brand']?.trim();

        let brand: Brand | null = await manager.findOne(Brand, {
          where: { name: brandName },
        });
        logger.debug('✅ Inserted brand', brand);

        if (!brand) {
          brand = await manager.save(Brand, {
            name: brandName,
            status: BrandStatus.ACTIVE,
          });
        }

        const product = await manager.save(Product, {
          name: row['variant_title'],
          description: row['description'],
          price: parsePrice(row['price']),
          brand,
          status:
            row['is_available'].toLowerCase() === 'true'
              ? ProductStatus.ACTIVE
              : ProductStatus.INACTIVE,
          stocking: 10,
          discount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        logger.debug('✅ Inserted product', product);

        const categoryName = row['category_name'].trim();

        let category: Category | null = await manager.findOne(Category, {
          where: { name: categoryName },
        });
        logger.debug('✅ Inserted category', category);

        if (!category) {
          category = await manager.save(Category, {
            name: categoryName,
            status: CategoryStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Tạo category mapping
        const categoryMapping: CategoryMapping = await manager.save(
          CategoryMapping,
          {
            product,
            category,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        );
        logger.debug('✅ Inserted category mapping', categoryMapping);

        const categoryMappingImage: Image = await manager.save(Image, {
          url: row['main_image_url'],
          type: ImageType.THUMBNAIL,
          subjectType: SubjectType.PRODUCT,
          subjectID: product.id,
          status: ImageStatus.ACTIVE,
          folder: 'products',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        logger.debug('✅ Inserted category mapping', categoryMappingImage);

        const allImages = row['all_images']
          .split(';')
          .map((url: string) => url.trim())
          .filter(Boolean);

        for (const url of allImages) {
          const image: Image = await manager.save(Image, {
            url,
            type: ImageType.PRODUCT,
            status: ImageStatus.ACTIVE,
            subjectType: SubjectType.PRODUCT,
            subjectID: product.id,
            folder: 'products',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          logger.debug('✅ Inserted image of product', image);
        }

        console.log(`✔ Seeded product: ${row['variant_title']}`);
      }
    });

    await dataSource.destroy();
    console.log('Seed dữ liệu thành công!');
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
