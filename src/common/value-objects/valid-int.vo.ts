import { BadRequestException } from '@nestjs/common';
import { ValueObjectErrorMessages } from '../constants/error-messages/value-object-error-messages';

export class ValidInt {
  public readonly value: number;

  constructor(value: string | number) {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(ValueObjectErrorMessages.VALID_INT.NOT_A_NUMBER(value));
    }

    if (!Number.isInteger(parsed)) {
      throw new BadRequestException(ValueObjectErrorMessages.VALID_INT.NOT_A_INTEGER(value));
    }

    if (parsed < 1) {
      throw new BadRequestException(ValueObjectErrorMessages.VALID_INT.TOO_SMALL(value));
    }

    if (parsed > Number.MAX_SAFE_INTEGER) {
      throw new BadRequestException(ValueObjectErrorMessages.VALID_INT.TOO_LARGE(value));
    }

    this.value = parsed;
  }

  get number(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
