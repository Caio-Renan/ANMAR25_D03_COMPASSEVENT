import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsGenericString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGenericString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string' && value !== null && value !== undefined) {
            return false;
          }

          const trimmed = (value ?? '').toString().trim();

          if (!trimmed) {
            return false;
          }

          if (trimmed.length < 4) {
            return false;
          }

          if (trimmed.length > 255) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments): string {
          const value = args.value;

          if (typeof value !== 'string' && value !== null && value !== undefined) {
            return ValidationErrorMessages.GENERIC_STRING.REQUIRED;
          }

          const trimmed = (value ?? '').toString().trim();

          if (!trimmed) {
            return ValidationErrorMessages.GENERIC_STRING.NOT_EMPTY;
          }

          if (trimmed.length < 4) {
            return ValidationErrorMessages.GENERIC_STRING.TOO_SHORT(4);
          }

          if (trimmed.length > 255) {
            return ValidationErrorMessages.GENERIC_STRING.TOO_LONG(255);
          }

          return 'Invalid generic string';
        },
      },
    });
  };
}
