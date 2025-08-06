import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { BadRequestException } from '@nestjs/common';
import { validate as isUuidValid } from 'uuid';

export class Uuid {
  private readonly _value: string;

  constructor(value: unknown) {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      throw new BadRequestException(ValidationErrorMessages.UUID.REQUIRED);
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(ValidationErrorMessages.UUID.MUST_BE_STRING);
    }

    if (!isUuidValid(value)) {
      throw new BadRequestException(ValidationErrorMessages.UUID.INVALID_TYPE(value));
    }

    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
