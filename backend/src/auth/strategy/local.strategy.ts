import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from 'src/db/helper/schema-type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    id: number,
    username: string,
  ): Promise<Omit<User, 'password'>> {
    const user: Omit<User, 'password'> = await this.authService.validateUser(
      id,
      username,
    );
    return user;
  }
}
