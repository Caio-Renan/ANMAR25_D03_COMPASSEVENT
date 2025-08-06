import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';

export class Email {
  private readonly _value: string;
  public static readonly maxLength: number = 100;

  constructor(email: string) {
    if (!email || !email.trim()) {
      throw new BadRequestException(ValidationErrorMessages.EMAIL.REQUIRED);
    }

    const trimmed = email.trim();

    if (trimmed.length > Email.maxLength) {
      throw new BadRequestException(ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength));
    }

    if (!isEmail(trimmed)) {
      throw new BadRequestException(ValidationErrorMessages.EMAIL.INVALID_TYPE);
    }

    this._value = trimmed.toLowerCase();
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }
}
