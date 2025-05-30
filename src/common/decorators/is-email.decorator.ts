import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import isEmail from 'validator/lib/isEmail';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string' || !value.trim()) {
            return false;
          }

          const trimmed = value.trim();

          if (trimmed.length > 100) {
            return false;
          }

          if (!isEmail(trimmed)) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments): string {
          const value = args.value as unknown;

          if (typeof value !== 'string' || !value.trim()) {
            return ValidationErrorMessages.EMAIL.REQUIRED;
          }

          const trimmed = (value as string).trim();

          if (trimmed.length > 100) {
            return ValidationErrorMessages.EMAIL.TOO_LONG(100);
          }

          if (!isEmail(trimmed)) {
            return ValidationErrorMessages.EMAIL.INVALID_TYPE;
          }

          return 'Invalid email';
        },
      },
    });
  };
}
