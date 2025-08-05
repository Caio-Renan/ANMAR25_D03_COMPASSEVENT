import { ValidationArguments } from 'class-validator';
import { ValidationErrorMessages } from 'common/constants/error-messages/validation-error-messages';

export const genericDateUtils = {
  trimDateInput(value: unknown): string | number | Date {
    if (typeof value === 'string') return value.trim();
    return value as string | number | Date;
  },
  isValidDate(value: unknown): boolean {
    const trimmed = genericDateUtils.trimDateInput(value);

    if (!(trimmed instanceof Date) && typeof trimmed !== 'string' && typeof trimmed !== 'number') {
      return false;
    }

    const date = trimmed instanceof Date ? trimmed : new Date(trimmed as string);

    return !isNaN(date.getTime());
  },
  getDateValidationError(value: unknown): string | null {
    const trimmed = genericDateUtils.trimDateInput(value);

    if (!(trimmed instanceof Date) && typeof trimmed !== 'string' && typeof trimmed !== 'number') {
      return ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE;
    }

    const date = trimmed instanceof Date ? trimmed : new Date(trimmed as string);

    if (isNaN(date.getTime())) {
      return ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(trimmed);
    }

    return null;
  },
};

export const genericDateValidator = {
  validate(value: unknown): boolean {
    return genericDateUtils.isValidDate(value);
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      genericDateUtils.getDateValidationError(args.value) ??
      ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE
    );
  },
};
