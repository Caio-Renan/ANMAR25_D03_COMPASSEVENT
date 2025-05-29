import { BadRequestException } from '@nestjs/common';

export class Password {
  private readonly _value: string;

  constructor(password: unknown) {
    if (typeof password !== 'string') {
      throw new BadRequestException('Password must be a string.');
    }

    const trimmed = password.trim();

    if (!trimmed) {
      throw new BadRequestException('Password is required.');
    }

    if (trimmed.length < 8 || trimmed.length > 64) {
      throw new BadRequestException('Password must be between 8 and 64 characters.');
    }

    if (/\s/.test(trimmed)) {
      throw new BadRequestException('Password should not contain spaces.');
    }

    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(trimmed)) {
      throw new BadRequestException('Password must contain letters and numbers.');
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
