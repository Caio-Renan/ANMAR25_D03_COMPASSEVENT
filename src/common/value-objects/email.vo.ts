import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';

export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!email || !email.trim()) {
      throw new BadRequestException('Email is required.');
    }

    const trimmed = email.trim();

    if (trimmed.length > 150) {
      throw new BadRequestException('Email must be at most 150 characters.');
    }

    if (!isEmail(trimmed)) {
      throw new BadRequestException('Invalid email format.');
    }

    this._value = trimmed.toLowerCase();
  }

  public get value(): string {
    return this._value; //rever
  }

  public toString(): string {
    return this._value;
  }
}
