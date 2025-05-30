import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string' || !value.trim()) {
            return false;
          }
          if (!value.startsWith('+')) {
            return false;
          }
          const phoneNumber = parsePhoneNumberFromString(value);
          return phoneNumber?.isValid() ?? false;
        },
        defaultMessage(args: ValidationArguments): string {
          const value = args.value;
          if (typeof value !== 'string' || !value.trim()) {
            return ValidationErrorMessages.PHONE_NUMBER.REQUIRED;
          }
          if (!value.startsWith('+')) {
            return ValidationErrorMessages.PHONE_NUMBER.MUST_START_WITH_PLUS;
          }
          const phoneNumber = parsePhoneNumberFromString(value);
          if (!phoneNumber || !phoneNumber.isValid()) {
            return ValidationErrorMessages.PHONE_NUMBER.INVALID_TYPE;
          }
          return 'Invalid phone number';
        },
      },
    });
  };
}
