import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { Name } from '@vo/name.vo';
import { ValidationArguments } from 'class-validator';

const NAME_REGEX = /^[A-Za-zÀ-ÿ\s.'-]+$/;

export const nameUtils = {
  trimName(value: unknown): string {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
  },
  isValidName(value: unknown): boolean {
    const trimmed = nameUtils.trimName(value);

    if (!trimmed) {
      return false;
    }

    if (trimmed.length > Name.maxLength) {
      return false;
    }

    if (!NAME_REGEX.test(trimmed)) {
      return false;
    }

    return true;
  },
  getNameValidationError(value: unknown): string | null {
    if (typeof value !== 'string') {
      return ValidationErrorMessages.NAME.INVALID_TYPE;
    }

    const trimmed = nameUtils.trimName(value);

    if (!trimmed) {
      return ValidationErrorMessages.NAME.REQUIRED;
    }

    if (trimmed.length > Name.maxLength) {
      return ValidationErrorMessages.NAME.TOO_LONG(Name.maxLength);
    }

    if (!NAME_REGEX.test(trimmed)) {
      return ValidationErrorMessages.NAME.INVALID_CHARACTERS;
    }

    return null;
  },
};

export const nameValidator = {
  validate(value: unknown): boolean {
    return nameUtils.isValidName(value);
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      nameUtils.getNameValidationError(args.value) ?? ValidationErrorMessages.NAME.INVALID_TYPE
    );
  },
};
