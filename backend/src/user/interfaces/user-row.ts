export interface UserRow {
  users: {
    id: number;
    username: string;
    password: string;
    name?: string | null;
    email: string;
    status: string; // hoặc enum UserStatus
  };
  user_details: {
    id: number;
    phone: string | null;
    adresss: string | null; // nếu đúng chính tả
    imageId: number;
  };
  roles: {
    name: string;
  };
  images: {
    url: string;
  };
}
