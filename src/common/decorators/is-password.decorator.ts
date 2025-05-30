import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;

          const trimmed = value.trim();

          if (!trimmed) return false;

          if (trimmed.length < 8 || trimmed.length > 64) return false;

          if (/\s/.test(trimmed)) return false;

          if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(trimmed)) return false;

          return true;
        },
        defaultMessage(args: ValidationArguments): string {
          const value = args.value;

          if (typeof value !== 'string') {
            return ValidationErrorMessages.PASSWORD.INVALID_TYPE;
          }

          const trimmed = value.trim();

          if (!trimmed) {
            return ValidationErrorMessages.PASSWORD.REQUIRED;
          }

          if (trimmed.length < 8 || trimmed.length > 64) {
            return ValidationErrorMessages.PASSWORD.LENGTH(8, 64);
          }

          if (/\s/.test(trimmed)) {
            return ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED;
          }

          if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(trimmed)) {
            return ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS;
          }

          return 'Invalid password';
        },
      },
    });
  };
}
