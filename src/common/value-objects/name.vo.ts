import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';

export class Name {
  private readonly _value: string;
  public static readonly maxLength: number = 64;
  public static readonly minLength: number = 4;

  constructor(name: unknown) {
    if (typeof name !== 'string') {
      throw new BadRequestException(ValidationErrorMessages.NAME.INVALID_TYPE);
    }

    const trimmed = name.replace(/\s+/g, ' ').trim();

    if (!trimmed) {
      throw new BadRequestException(ValidationErrorMessages.NAME.REQUIRED);
    }

    if (trimmed.length < Name.minLength) {
      throw new BadRequestException(ValidationErrorMessages.NAME.TOO_SHORT(Name.minLength));
    }

    if (trimmed.length > Name.maxLength) {
      throw new BadRequestException(ValidationErrorMessages.NAME.TOO_LONG(Name.maxLength));
    }

    if (!/^[A-Za-zÀ-ÿ\s.'-]+$/.test(trimmed)) {
      throw new BadRequestException(ValidationErrorMessages.NAME.INVALID_CHARACTERS);
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
