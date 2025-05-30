import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') {
            return false;
          }

          const trimmed = value.replace(/\s+/g, ' ').trim();
          if (!trimmed) {
            return false;
          }

          if (trimmed.length > 64) {
            return false;
          }

          if (!/^[A-Za-zÀ-ÿ\s.'-]+$/.test(trimmed)) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments): string {
          const value = args.value;
          if (typeof value !== 'string') {
            return ValidationErrorMessages.NAME.INVALID_TYPE;
          }

          const trimmed = value.replace(/\s+/g, ' ').trim();
          if (!trimmed) {
            return ValidationErrorMessages.NAME.REQUIRED;
          }

          if (trimmed.length > 64) {
            return ValidationErrorMessages.NAME.TOO_LONG(64);
          }

          if (!/^[A-Za-zÀ-ÿ\s.'-]+$/.test(trimmed)) {
            return ValidationErrorMessages.NAME.INVALID_CHARACTERS;
          }

          return 'Invalid name';
        },
      },
    });
  };
}
