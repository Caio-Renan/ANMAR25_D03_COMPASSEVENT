import { BadRequestException } from '@nestjs/common';

export class PersonName {
  private readonly _value: string;

  constructor(name: unknown) {
    if (typeof name !== 'string') {
      throw new BadRequestException('Name must be a string.');
    }

    const trimmed = name.replace(/\s+/g, ' ').trim();

    if (!trimmed) {
      throw new BadRequestException('Name is required.');
    }

    if (trimmed.length > 100) {
      throw new BadRequestException('Name must be at most 100 characters.');
    }

    if (!/^[A-Za-zÀ-ÿ\s.'-]+$/.test(trimmed)) {
      throw new BadRequestException(
        'Name must contain only letters, spaces, dots, apostrophes, or hyphens.',
      );
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
