import { ErrorMessage } from '@messages/error.messages';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'notUrl', async: false })
export class NotUrlValidator implements ValidatorConstraintInterface {
  urlNoRequireHttpRegex: RegExp =
    /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(text: string, _args: ValidationArguments) {
    return !this.urlNoRequireHttpRegex.test(text);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return ErrorMessage.PARAM_MUST_NOT_BE_A_LINK;
  }
}
