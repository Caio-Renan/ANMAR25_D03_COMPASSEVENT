import { BadRequestException } from '@nestjs/common';
import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';

export class Password {
  private readonly _value: string;
  public static readonly minLength: number = 8;
  public static readonly maxLength: number = 64;

  constructor(password: unknown) {
    if (typeof password !== 'string') {
      throw new BadRequestException(ValidationErrorMessages.PASSWORD.INVALID_TYPE);
    }

    const trimmed = password.trim();

    if (!trimmed) {
      throw new BadRequestException(ValidationErrorMessages.PASSWORD.REQUIRED);
    }

    if (trimmed.length < Password.minLength || trimmed.length > Password.maxLength) {
      throw new BadRequestException(
        ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
      );
    }

    if (/\s/.test(trimmed)) {
      throw new BadRequestException(ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED);
    }

    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(trimmed)) {
      throw new BadRequestException(
        ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS,
      );
    }

    this._value = trimmed;
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }
}
