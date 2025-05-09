import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { NotUrlValidator } from 'src/helper/class-validator-contraint/not-url.validator';
import { UserStatus } from 'src/helper/enum/user-status.enum';
import { ErrorMessage } from 'src/helper/message/error-message';

export class GetAllUsersDto {
  @IsInt({ message: ErrorMessage.PAGE_MUST_BE_INTETER })
  @Min(1, { message: ErrorMessage.PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER })
  page: number;

  @IsInt({ message: ErrorMessage.LIMIT_MUST_BE_INTETER })
  @Min(10, { message: ErrorMessage.LIMIT_HAVE_AT_LEAST_10 })
  limit: number;
}

export class CreateUserDto {
  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  @Validate(NotUrlValidator)
  username: string;

  @IsEmail({}, { message: ErrorMessage.INVALID_EMAIL })
  @Validate(NotUrlValidator)
  email: string;

  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  @Validate(NotUrlValidator)
  hashedPassword: string;

  @IsInt({ message: ErrorMessage.PARAM_NOT_VALID })
  roleId: number;

  @IsEnum({ message: ErrorMessage.PARAM_NOT_VALID })
  status: UserStatus;
}

export class FindUserById {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  id: number;
}

export class FindUserByName {
  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  name: string;
}

export class UserUpdateDTO {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  id: number;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  name: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  email: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  phone: string;

  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  address: string;
}
