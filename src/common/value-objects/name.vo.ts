import { BadRequestException } from '@nestjs/common';
import { ValueObjectErrorMessages } from '../constants/error-messages/value-object-error-messages';

export class Name {
  private readonly _value: string;
  public static readonly maxLength: number = 64;

  constructor(name: unknown) {
    if (typeof name !== 'string') {
      throw new BadRequestException(ValueObjectErrorMessages.NAME.INVALID_TYPE);
    }

    const trimmed = name.replace(/\s+/g, ' ').trim();

    if (!trimmed) {
      throw new BadRequestException(ValueObjectErrorMessages.NAME.REQUIRED);
    }

    if (trimmed.length > Name.maxLength) {
      throw new BadRequestException(ValueObjectErrorMessages.NAME.TOO_LONG(Name.maxLength));
    }

    if (!/^[A-Za-zÀ-ÿ\s.'-]+$/.test(trimmed)) {
      throw new BadRequestException(ValueObjectErrorMessages.NAME.INVALID_CHARACTERS);
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
