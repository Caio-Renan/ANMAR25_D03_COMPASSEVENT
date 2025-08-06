import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { BadRequestException } from '@nestjs/common';

export class GenericDate {
  private readonly _value: Date;

  constructor(value: Date | string | number) {
    if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
      throw new BadRequestException(ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE);
    }

    const parsedValue = typeof value === 'string' ? value.trim() : value;

    const date = parsedValue instanceof Date ? parsedValue : new Date(parsedValue);

    if (isNaN(date.getTime())) {
      throw new BadRequestException(ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(value));
    }

    this._value = new Date(date.getTime());
  }

  public get value(): Date {
    return new Date(this._value.getTime());
  }

  toISOString(): string {
    return this._value.toISOString();
  }

  toString(): string {
    return this._value.toISOString();
  }
}
