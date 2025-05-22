import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/db/helper/schema-type';
import { AuthService } from '../auth.service';
import { plainToInstance } from 'class-transformer';
import { UserLoginDTO } from 'src/helper/dto/user/user-login.dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * @description: validate user when the client send a request
   * @param username: username of user
   * @param password: password of user
   * @returns user
   */
  async validate(username: string, password: string): Promise<User> {
    const dto = plainToInstance(UserLoginDTO, { username, password });
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.authService.validateUser(username, password);
  }
}
