import { IsInt, IsString, Validate } from 'class-validator';
import { NotUrlValidator } from '../../class-validator-contraint/not-url.validator';
import { ErrorMessage } from '../../message/error-message';

export class FindUserById {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  id: number;
}

export class FindUserByName {
  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  name: string;
}
