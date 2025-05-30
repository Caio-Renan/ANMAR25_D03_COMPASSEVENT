import { BadRequestException } from '@nestjs/common';
import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';

export class Base64Image {
  public readonly value: string;

  private static readonly base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

  constructor(value: string) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.REQUIRED);
    }

    const trimmed = value.trim();

    const base64 = trimmed.includes(',') ? trimmed.split(',')[1] : trimmed;

    if (base64.length % 4 !== 0) {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4);
    }

    if (!Base64Image.base64Regex.test(base64)) {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.INVALID);
    }

    this.value = base64;
  }

  get base64(): string {
    return this.value;
  }

  toBuffer(): Buffer {
    return Buffer.from(this.value, 'base64');
  }

  toString(): string {
    return this.value;
  }
}
