import { BadRequestException } from '@nestjs/common';

export class GenericString {
  private readonly _value: string;

  constructor(value: unknown, minLength = 1, maxLength = 255) {
    if (typeof value !== 'string' && value !== null && value !== undefined) {
      throw new BadRequestException('Value must be a string.');
    }

    const trimmed = (value ?? '').trim();

    if (!trimmed) {
      throw new BadRequestException('String cannot be empty.');
    }

    if (trimmed.length < minLength) {
      throw new BadRequestException(`String must be at least ${minLength} characters long.`);
    }

    if (trimmed.length > maxLength) {
      throw new BadRequestException(`String must be at most ${maxLength} characters long.`);
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
