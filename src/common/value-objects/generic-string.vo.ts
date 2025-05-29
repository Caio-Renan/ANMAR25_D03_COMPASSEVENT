import { BadRequestException } from '@nestjs/common';
import { ValueObjectErrorMessages } from '../constants/error-messages/value-object-error-messages';

export class GenericString {
  private readonly _value: string;
  public static readonly minLength: number = 4;
  public static readonly maxLength: number = 255;

  constructor(value: unknown) {
    if (typeof value !== 'string' && value !== null && value !== undefined) {
      throw new BadRequestException(ValueObjectErrorMessages.GENERIC_STRING.REQUIRED);
    }

    const trimmed = (value ?? '').trim();

    if (!trimmed) {
      throw new BadRequestException(ValueObjectErrorMessages.GENERIC_STRING.NOT_EMPTY);
    }

    if (trimmed.length < GenericString.minLength) {
      throw new BadRequestException(
        ValueObjectErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength),
      );
    }

    if (trimmed.length > GenericString.maxLength) {
      throw new BadRequestException(
        ValueObjectErrorMessages.GENERIC_STRING.TOO_LONG(GenericString.maxLength),
      );
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
