import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ErrorMessage } from 'src/helper/message/error-message';

@ValidatorConstraint({ async: true })
export class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = args.object as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return value === object.password;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args?: ValidationArguments) {
    return ErrorMessage.PASSWORD_MISMATCH;
  }
}
