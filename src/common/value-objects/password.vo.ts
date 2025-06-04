import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

export class Password {
  private readonly _value: string;
  public static readonly minLength = 8;
  public static readonly maxLength = 64;

  constructor(password: string, options?: { isHashed?: boolean }) {
    if (options?.isHashed) {
      this._value = password;
      return;
    }

    const error = Password.getValidationError(password);
    if (error) {
      throw new BadRequestException(error);
    }

    this._value = password;
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public static getValidationError(value: unknown): string | null {
    if (typeof value !== 'string') {
      return ValidationErrorMessages.PASSWORD.INVALID_TYPE;
    }

    if (value === '') {
      return ValidationErrorMessages.PASSWORD.REQUIRED;
    }

    if (/\s/.test(value)) {
      return ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED;
    }

    if (value.length < Password.minLength || value.length > Password.maxLength) {
      return ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength);
    }

    if (!passwordRegex.test(value)) {
      return ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS;
    }

    return null;
  }

  public static isValid(value: unknown): boolean {
    return Password.getValidationError(value) === null;
  }
}
