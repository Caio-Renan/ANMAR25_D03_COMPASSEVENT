import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments): boolean {
          if (typeof value !== 'string' || !value.trim()) {
            return false;
          }

          const trimmed = value.trim();
          const base64 = trimmed.includes(',') ? trimmed.split(',')[1] : trimmed;

          if (base64.length % 4 !== 0) {
            return false;
          }

          const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
          if (!base64Regex.test(base64)) {
            return false;
          }

          return true;
        },

        defaultMessage(args: ValidationArguments): string {
          const value = args.value as unknown;

          if (typeof value !== 'string' || !value.trim()) {
            return ValidationErrorMessages.BASE64_IMAGE.REQUIRED;
          }

          const trimmed = (value as string).trim();
          const base64 = trimmed.includes(',') ? trimmed.split(',')[1] : trimmed;

          if (base64.length % 4 !== 0) {
            return ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4;
          }

          const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
          if (!base64Regex.test(base64)) {
            return ValidationErrorMessages.BASE64_IMAGE.INVALID;
          }

          return 'Invalid Base64 image string';
        },
      },
    });
  };
}
