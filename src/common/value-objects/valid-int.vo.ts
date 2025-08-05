import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { BadRequestException } from '@nestjs/common';

export class ValidInt {
  public static readonly minLength = 1;
  public static readonly maxLength = Number.MAX_SAFE_INTEGER;

  public readonly value: number;

  constructor(value: string | number) {
    const error = ValidInt.getValidationError(value);
    if (error) {
      throw new BadRequestException(error);
    }

    this.value = typeof value === 'string' ? Number(value) : value;
  }

  static getValidationError(value: unknown): string | null {
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
  }

  get number(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
