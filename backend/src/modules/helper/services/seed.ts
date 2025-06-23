import { images, roles, users } from '@schema';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

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

  // Chèn dữ liệu mẫu
  await db.insert(roles).values([
    { id: 1, name: 'admin', status: 'active' },
    { id: 2, name: 'user', status: 'active' },
  ]);

  await db.insert(images).values({
    id: 1,
    url: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1747916657/pngegg_1_elsdfw.png',
    type: 'avatar',
    folder: 'tmdt-ck',
    created_at: new Date(),
    updated_at: new Date(),
  });

  await db.insert(users).values({
    email: 'admin@gmail.com',
    username: 'admin',
    password: await bcrypt.hash('123123', saltOrRounds),
    roleId: 1,
  });

  await connection.end();
  console.log('Seed dữ liệu thành công!');
}
