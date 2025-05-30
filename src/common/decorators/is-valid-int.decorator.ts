import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsValidInt(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidInt',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value === 'string' && value.trim() === '') {
            return false;
          }

          const num = typeof value === 'string' ? Number(value) : value;

          if (typeof num !== 'number' || Number.isNaN(num)) {
            return false;
          }

          if (!Number.isInteger(num)) {
            return false;
          }

          if (num < 1) {
            return false;
          }

          if (num > Number.MAX_SAFE_INTEGER) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments): string {
          const val = args.value;

          if (typeof val === 'string' && val.trim() === '') {
            return ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(val);
          }

          const num = typeof val === 'string' ? Number(val) : val;

          if (typeof num !== 'number' || Number.isNaN(num)) {
            return ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(val);
          }

          if (!Number.isInteger(num)) {
            return ValidationErrorMessages.VALID_INT.NOT_A_INTEGER(val);
          }

          if (num < 1) {
            return ValidationErrorMessages.VALID_INT.TOO_SMALL(val);
          }

          if (num > Number.MAX_SAFE_INTEGER) {
            return ValidationErrorMessages.VALID_INT.TOO_LARGE(val);
          }

          return 'Invalid integer value';
        },
      },
    });
  };
}
