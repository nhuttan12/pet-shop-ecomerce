import { CsvProduct } from './interfaces/csvProduct.interface';
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
import { User } from '@user/entites/users.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import bcrypt from 'bcrypt';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';

const parsePrice = (price: string): number =>
  parseInt(price.replace(/[^\d]/g, ''));

export async function main() {
  const saltOrRounds = 10;

  // Tạo kết nối đến DB
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'thuc2003',
    database: 'tmdt-ck',
    entities: [
      /* add your entities here */
    ],
    synchronize: true,
  });

  await dataSource.initialize();

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
    await manager.insert(Role, [
      { id: 1, name: 'ADMIN', status: RoleStatus.ACTIVE },
      { id: 2, name: 'USER', status: RoleStatus.ACTIVE },
      { id: 3, name: 'CUSTOMER', status: RoleStatus.ACTIVE },
      { id: 4, name: 'MANAGER', status: RoleStatus.ACTIVE },
      { id: 5, name: 'MARKETING_EMPLOYEE', status: RoleStatus.ACTIVE },
      { id: 6, name: 'SALE_EMPLOYEE', status: RoleStatus.ACTIVE },
    ]);

    await manager.save(Image, {
      url: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1747916657/pngegg_1_elsdfw.png',
      type: ImageType.AVATAR,
      folder: 'tmdt-ck',
      status: ImageStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await manager.save(User, {
      email: 'admin@gmail.com',
      username: 'admin',
      password: await bcrypt.hash('123123', saltOrRounds),
      status: UserStatus.ACTIVE,
      role: { id: 1 },
    });

    for (const row of records) {
      const brandName = row['brand']?.trim();

      let brand = await manager.findOne(Brand, {
        where: { name: brandName },
      });

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

      const categoryName = row['category_name'].trim();

      let category = await manager.findOne(Category, {
        where: { name: categoryName },
      });

      if (!category) {
        category = await manager.save(Category, {
          name: categoryName,
          status: CategoryStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await manager.save(CategoryMapping, {
        product,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Tạo category mapping
      await manager.save(Image, {
        url: row['main_image_url'],
        type: ImageType.THUMBNAIL,
        subjectType: SubjectType.PRODUCT,
        subjectID: product.id,
        status: ImageStatus.ACTIVE,
        folder: 'products',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const allImages = row['all_images']
        .split(';')
        .map((url: string) => url.trim())
        .filter(Boolean);

      for (const url of allImages) {
        await manager.save(Image, {
          url,
          type: ImageType.PRODUCT,
          status: ImageStatus.ACTIVE,
          subjectType: SubjectType.PRODUCT,
          subjectID: product.id,
          folder: 'products',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(`✔ Seeded product: ${row['variant_title']}`);
    }
  });

  await dataSource.destroy();
  console.log('Seed dữ liệu thành công!');
}
