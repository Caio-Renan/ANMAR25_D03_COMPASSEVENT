import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { Password } from '@vo/password.vo';
import { ValidationArguments } from 'class-validator';

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

export const passwordUtils = {
  getPasswordValidationError(value: unknown): string | null {
    if (typeof value !== 'string' || value === null) {
      return ValidationErrorMessages.PASSWORD.INVALID_TYPE;
    }

    if (value.trim() === '') {
      return ValidationErrorMessages.PASSWORD.REQUIRED;
    }

    if (value.length < Password.minLength || value.length > Password.maxLength) {
      return ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength);
    }

    if (/\s/.test(value)) {
      return ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED;
    }

    if (!passwordRegex.test(value)) {
      return ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS;
    }

    return null;
  },
  isValidPassword(value: unknown): boolean {
    return passwordUtils.getPasswordValidationError(value) === null;
  },
};

export const passwordValidator = {
  validate(value: unknown): boolean {
    return passwordUtils.getPasswordValidationError(value) === null;
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      passwordUtils.getPasswordValidationError(args.value) ??
      ValidationErrorMessages.PASSWORD.INVALID_TYPE
    );
  },
};
