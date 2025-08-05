import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { ValidationArguments } from 'class-validator';
import { validate as isUuidValid } from 'uuid';

export const uuidUtils = {
  isValidUuid(value: unknown): boolean {
    if (typeof value !== 'string' || !value.trim()) {
      return false;
    }

    return isUuidValid(value);
  },

  getUuidValidationError(value: unknown): string | null {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return ValidationErrorMessages.UUID.REQUIRED;
    }

    if (typeof value !== 'string') {
      return ValidationErrorMessages.UUID.MUST_BE_STRING;
    }

    if (!isUuidValid(value)) {
      return ValidationErrorMessages.UUID.INVALID_TYPE(value);
    }

    return null;
  },
};

export const uuidValidator = {
  validate(value: unknown): boolean {
    return uuidUtils.isValidUuid(value);
  },
  defaultMessage(args: ValidationArguments): string {
    return (
      uuidUtils.getUuidValidationError(args.value) ??
      ValidationErrorMessages.UUID.INVALID_TYPE(args.value)
    );
  },
};
