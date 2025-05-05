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

  /**
   * @description: validate user when the client send a request
   * @param id: id in jwt payload
   * @param username: name in jwt payload
   * @returns user
   */
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
