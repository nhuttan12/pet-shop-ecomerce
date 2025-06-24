import { AuthService } from '@core-modules/auth/auth.service';
import { UserLoginDTO } from '@dtos/user/user-login.dto';
import { ErrorMessage } from '@message/error-message';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@schema-type';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-admin',
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const dto = plainToInstance(UserLoginDTO, { username, password });
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const user: User = await this.authService.validateUser(username, password);
    if (![1, 4, 5, 6].includes(user.roleId)) {
      throw new BadRequestException(
        ErrorMessage.USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE,
      );
    }
    return user;
  }
}
