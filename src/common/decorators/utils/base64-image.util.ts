import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { ValidationArguments } from 'class-validator';

const BASE64_REGEX = /^[A-Za-z0-9+/]+={0,2}$/;

export const base64ImageUtils = {
  extractBase64(value: string): string {
    const trimmed = value.trim();
    return trimmed.includes(',') ? trimmed.split(',')[1] : trimmed;
  },

  isValidBase64(value: string): boolean {
    const base64 = base64ImageUtils.extractBase64(value);
    return BASE64_REGEX.test(base64) && base64.length % 4 === 0;
  },

  getBase64ValidationError(value: unknown): string | null {
    if (typeof value !== 'string' || !value.trim()) {
      return ValidationErrorMessages.BASE64_IMAGE.REQUIRED;
    }

    const base64 = base64ImageUtils.extractBase64(value);

    if (!BASE64_REGEX.test(base64)) {
      return ValidationErrorMessages.BASE64_IMAGE.INVALID;
    }

    if (base64.length % 4 !== 0) {
      return ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4;
    }

    return null;
  },
};

export const base64ImageValidator = {
  validate(value: unknown): boolean {
    return base64ImageUtils.getBase64ValidationError(value) === null;
  },

  defaultMessage(args: ValidationArguments): string {
    return (
      base64ImageUtils.getBase64ValidationError(args.value) ??
      ValidationErrorMessages.BASE64_IMAGE.INVALID
    );
  },
};
