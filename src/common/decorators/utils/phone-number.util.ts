import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { ValidationArguments } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const phoneNumberUtils = {
  isValidPhoneNumber(value: unknown): boolean {
    if (typeof value !== 'string' || !value.trim()) {
      return false;
    }

    if (!value.startsWith('+')) {
      return false;
    }

    const phoneNumber = parsePhoneNumberFromString(value);
    return phoneNumber?.isValid() ?? false;
  },

  getPhoneNumberValidationError(value: unknown): string | null {
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

    return null;
  },
};

export const phoneNumberValidator = {
  validate(value: unknown): boolean {
    return phoneNumberUtils.getPhoneNumberValidationError(value) === null;
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      phoneNumberUtils.getPhoneNumberValidationError(args.value) ??
      ValidationErrorMessages.PHONE_NUMBER.INVALID_TYPE
    );
  },
};
