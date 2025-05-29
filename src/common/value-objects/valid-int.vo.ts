import { BadRequestException } from '@nestjs/common';

export class ValidInt {
  public readonly value: number;

  constructor(value: string | number) {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(`Value '${value}' is not a number`);
    }

    if (!Number.isInteger(parsed)) {
      throw new BadRequestException(`Value '${value}' must be an integer`);
    }

    if (parsed < 1) {
      throw new BadRequestException(`Value '${value}' must be greater than or equal to 1`);
    }

    if (parsed > Number.MAX_SAFE_INTEGER) {
      throw new BadRequestException(
        `Value '${value}' must be less than or equal to ${Number.MAX_SAFE_INTEGER}`,
      );
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
