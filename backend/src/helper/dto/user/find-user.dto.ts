import { IsInt, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage } from '@message/error-message';
import { NotUrlValidator } from '@validator';

export class FindUserById {
  @IsInt({ message: ErrorMessage.USER_ID_MUST_BE_INTEGER })
  @ApiProperty()
  id: number;
}

export class FindUserByName {
  @IsString({ message: ErrorMessage.USER_FULL_NAME_MUST_BE_STRING })
  @Validate(NotUrlValidator)
  @ApiProperty()
  name: string;
}
