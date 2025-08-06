import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { GenericString } from '@vo/generic-string.vo';
import { ValidationArguments } from 'class-validator';

export const genericStringUtils = {
  trimString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : (value ?? '').toString().trim();
  },
  isValidGenericString(value: unknown): boolean {
    const trimmed = genericStringUtils.trimString(value);

    if (typeof value !== 'string' && value !== null && value !== undefined) {
      return false;
    }

    if (!trimmed) {
      return false;
    }

    if (trimmed.length < GenericString.minLength) {
      return false;
    }

    if (trimmed.length > GenericString.maxLength) {
      return false;
    }

    return true;
  },
  getGenericStringValidationError(value: unknown): string | null {
    if (typeof value !== 'string' && value !== null && value !== undefined) {
      return ValidationErrorMessages.GENERIC_STRING.REQUIRED;
    }

    const trimmed = genericStringUtils.trimString(value);

    if (!trimmed) {
      return ValidationErrorMessages.GENERIC_STRING.NOT_EMPTY;
    }

    if (trimmed.length < GenericString.minLength) {
      return ValidationErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength);
    }

    if (trimmed.length > GenericString.maxLength) {
      return ValidationErrorMessages.GENERIC_STRING.TOO_LONG(GenericString.maxLength);
    }

    return null;
  },
};

export const genericStringValidator = {
  validate(value: unknown): boolean {
    return genericStringUtils.isValidGenericString(value);
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      genericStringUtils.getGenericStringValidationError(args.value) ??
      ValidationErrorMessages.GENERIC_STRING.REQUIRED
    );
  },
};
