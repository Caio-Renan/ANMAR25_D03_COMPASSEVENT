import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { ValidInt } from '@vo/valid-int.vo';
import { ValidationArguments } from 'class-validator';

export const validIntUtils = {
  isValidInt(value: unknown): boolean {
    const num = typeof value === 'string' ? Number(value) : value;

    if (typeof num !== 'number' || Number.isNaN(num)) {
      return false;
    }

    if (!Number.isInteger(num)) {
      return false;
    }

    if (num < ValidInt.minLength) {
      return false;
    }

    if (num > ValidInt.maxLength) {
      return false;
    }

    return true;
  },

  getIntValidationError(value: unknown): string | null {
    if (typeof value === 'string' && value.trim() === '') {
      return ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(value);
    }

    const num = typeof value === 'string' ? Number(value) : value;

    if (typeof num !== 'number' || Number.isNaN(num)) {
      return ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(value);
    }

    if (!Number.isInteger(num)) {
      return ValidationErrorMessages.VALID_INT.NOT_A_INTEGER(value);
    }

    if (num < ValidInt.minLength) {
      return ValidationErrorMessages.VALID_INT.TOO_SMALL(value);
    }

    if (num > ValidInt.maxLength) {
      return ValidationErrorMessages.VALID_INT.TOO_LARGE(value);
    }

    return null;
  },
};

export const validIntValidator = {
  validate(value: unknown): boolean {
    return validIntUtils.isValidInt(value);
  },
  defaultMessage(args: ValidationArguments): string {
    return (
      validIntUtils.getIntValidationError(args.value) ??
      ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(args.value)
    );
  },
};
