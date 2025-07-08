export class UserLoginResponseDTO {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
  };
}
