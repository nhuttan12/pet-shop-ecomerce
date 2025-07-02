import { Brand, BrandStatus } from '@brand';
import { Category, CategoryMapping, CategoryStatus } from '@category';
import { CsvProduct, Image, ImageStatus, ImageType } from '@common';
import { Product, ProductImage, ProductStatus } from '@product';
import { Role, RoleStatus } from '@role';
import { User, UserStatus } from '@user';
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
      const mainImage = await manager.save(Image, {
        url: row['main_image_url'],
        type: ImageType.THUMBNAIL,
        status: ImageStatus.ACTIVE,
        folder: 'products',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Main Image
      await manager.save(ProductImage, {
        product,
        image: mainImage,
        folder: 'products',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const allImages = row['all_images']
        .split(';')
        .map((url: string) => url.trim())
        .filter(Boolean);

      for (const url of allImages) {
        const galleryImage = await manager.save(Image, {
          url,
          type: ImageType.PRODUCT,
          status: ImageStatus.ACTIVE,
          folder: 'products',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await manager.save(ProductImage, {
          product,
          image: galleryImage,
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
