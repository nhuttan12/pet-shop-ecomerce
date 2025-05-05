import { IsEmail, IsInt, IsString, IsUrl, Min } from 'class-validator';
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
  username: string;

  @IsEmail({}, { message: ErrorMessage.INVALID_EMAIL })
  email: string;

  @IsString({ message: ErrorMessage.PARAM_NOT_VALID })
  hashedPassword: string;

  @IsInt({ message: ErrorMessage.PARAM_NOT_VALID })
  roleId: number;

  @IsInt({ message: ErrorMessage.PARAM_NOT_VALID })
  statusId: number;
}

export class FindUserById {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  id: number;
}

export class FindUserByName {
  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @IsUrl({}, { message: ErrorMessage.PARAM_MUST_NOT_BE_A_LINK })
  name: string;
}
