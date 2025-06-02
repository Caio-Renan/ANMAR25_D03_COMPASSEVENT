import { ValidationArguments } from 'class-validator';
import { ValidationErrorMessages } from 'src/common/constants/error-messages/validation-error-messages';
import { Email } from 'src/common/value-objects/email.vo';
import isEmail from 'validator/lib/isEmail';

export const emailUtils = {
  trimEmail(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  },
  isValidEmail(value: unknown): boolean {
    const trimmed = emailUtils.trimEmail(value);

    if (!trimmed) {
      return false;
    }

    if (trimmed.length > Email.maxLength) {
      return false;
    }

    return isEmail(trimmed);
  },
  getEmailValidationError(value: unknown): string | null {
    if (typeof value !== 'string' || !value.trim()) {
      return ValidationErrorMessages.EMAIL.REQUIRED;
    }

    const trimmed = emailUtils.trimEmail(value);

    if (trimmed.length > Email.maxLength) {
      return ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength);
    }

    if (!isEmail(trimmed)) {
      return ValidationErrorMessages.EMAIL.INVALID_TYPE;
    }

    return null;
  },
};

export const emailValidator = {
  validate(value: unknown): boolean {
    return emailUtils.getEmailValidationError(value) === null;
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      emailUtils.getEmailValidationError(args.value) ?? ValidationErrorMessages.EMAIL.INVALID_TYPE
    );
  },
};
