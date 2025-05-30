import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsGenericDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGenericDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
            return false;
          }

          const date = value instanceof Date ? value : new Date(value as any);

          if (isNaN(date.getTime())) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments): string {
          const value = args.value;

          if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
            return ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE;
          }

          const date = value instanceof Date ? value : new Date(value as any);

          if (isNaN(date.getTime())) {
            return ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(value);
          }

          return 'Invalid date';
        },
      },
    });
  };
}
