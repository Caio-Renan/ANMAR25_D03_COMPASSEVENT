import { BadRequestException } from '@nestjs/common';

export class GenericDate {
  private readonly _value: Date;

  constructor(value: Date | string | number) {
    if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
      throw new BadRequestException(
        'Invalid type: value must be a Date object, a date string, or a timestamp number.',
      );
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Provided value is not a valid date.');
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
