import { ErrorMessage } from '@message/error-message';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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
