import { BadRequestException } from '@nestjs/common';
import { ValueObjectErrorMessages } from '../constants/error-messages/value-object-error-messages';

export class GenericDate {
  private readonly _value: Date;

  constructor(value: Date | string | number) {
    if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
      throw new BadRequestException(ValueObjectErrorMessages.GENERIC_DATE.INVALID_TYPE);
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException(ValueObjectErrorMessages.GENERIC_DATE.INVALID_VALUE(value));
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
