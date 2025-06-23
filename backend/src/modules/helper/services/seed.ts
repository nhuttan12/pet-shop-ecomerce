import { ImageType } from '@enum/image-type.enum';
import { ImageStatus } from '@enum/status/image-status.enum';
import { ProductStatus } from '@enum/status/product-status.enum';
import { brands, images, productImages, products, roles, users } from '@schema';
import { Brand } from '@schema-type';
import bcrypt from 'bcrypt';
import csv from 'csv-parser';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';
import { CsvProduct } from './../../../helper/interface/csvProduct.interface';
import { RoleStatus } from '@enum/status/role-status.enum';
import { Role } from '@enum/role.enum';
import { BrandStatus } from '@enum/status/brand-status.enum';

const parsePrice = (price: string): number =>
  parseInt(price.replace(/[^\d]/g, ''));

export async function main() {
  const saltOrRounds = 10;

  // Tạo kết nối đến DB
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'tmdt-ck',
  });
  const db = drizzle(connection);
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
  await db.transaction(async (tx) => {
    for (const row of records) {
      const brandName = row['brand']?.trim();

      const [brandRecord]: Brand[] = await tx
        .select()
        .from(brands)
        .where(eq(brands.name, brandName));

      let brandId = brandRecord?.id;
      console.log(brandId);

      if (!brandId) {
        const [insertedBrand]: { id: number }[] = await tx
          .insert(brands)
          .values({ name: brandName, status: BrandStatus.ACTIVE })
          .$returningId();

        if (!insertedBrand) throw new Error('Insert brand failed');

        brandId = insertedBrand.id;
        console.log(brandId);
      }

      const productInsert = await tx
        .insert(products)
        .values({
          name: row['variant_title'],
          description: row['description'],
          price: parsePrice(row['price']),
          brandId: brandId,
          status:
            row['is_available'].toLowerCase() === 'True'
              ? ProductStatus.ACTIVE
              : ProductStatus.INACTIVE,
          stocking: 10,
          discount: 0,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      const productId = productInsert[0].id;

      // Main Image
      const mainImage = await tx
        .insert(images)
        .values({
          url: row['main_image_url'],
          type: ImageType.THUMBNAIL,
          status: ImageStatus.ACTIVE,
          folder: 'products',
          created_at: new Date(),
          updated_at: new Date(),
        })
        .$returningId();

      await db.insert(productImages).values({
        productId,
        imageId: mainImage[0].id,
        folder: 'products',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Gallery Images
      const allImages = row['all_images']
        .split(';')
        .map((url: string) => url.trim())
        .filter(Boolean);

      for (const imageUrl of allImages) {
        const image = await tx
          .insert(images)
          .values({
            url: imageUrl,
            type: ImageType.PRODUCT,
            status: ImageStatus.ACTIVE,
            folder: 'products',
            created_at: new Date(),
            updated_at: new Date(),
          })
          .$returningId();

        await tx.insert(productImages).values({
          productId,
          imageId: image[0].id,
          folder: 'products',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      console.log(`✔ Seeded product: ${row['variant_title']}`);
    }

    // Chèn dữ liệu mẫu
    await tx.insert(roles).values([
      { id: 1, name: Role.ADMIN, status: RoleStatus.ACTIVE },
      { id: 2, name: Role.USER, status: RoleStatus.ACTIVE },
      { id: 3, name: Role.CUSTOMER, status: RoleStatus.ACTIVE },
      { id: 4, name: Role.MANAGER, status: RoleStatus.ACTIVE },
      { id: 5, name: Role.MARKETING_EMPLOYEE, status: RoleStatus.ACTIVE },
      { id: 6, name: Role.SALE_EMPLOYEE, status: RoleStatus.ACTIVE },
    ]);

    await tx.insert(images).values({
      id: 1,
      url: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1747916657/pngegg_1_elsdfw.png',
      type: 'avatar',
      folder: 'tmdt-ck',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await tx.insert(users).values({
      email: 'admin@gmail.com',
      username: 'admin',
      password: await bcrypt.hash('123123', saltOrRounds),
      roleId: 1,
    });
  });

  await connection.end();
  console.log('Seed dữ liệu thành công!');
}
