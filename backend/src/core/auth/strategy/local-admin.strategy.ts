import { AuthService } from '@auth/auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserLoginDTO } from '@user/dto/user-login.dto';
import { User } from '@user/entites/users.entity';
import { AuthErrorMessages } from 'auth/messages/auth.error-messages';
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
    if (![1, 4, 5, 6].includes(user.role.id)) {
      throw new BadRequestException(
        AuthErrorMessages.USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE,
      );
    }
    return user;
  }
}
