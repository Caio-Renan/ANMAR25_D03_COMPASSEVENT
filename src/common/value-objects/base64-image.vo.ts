import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../constants/error-messages/validation-error-messages';

export class Base64Image {
  public readonly value: string;
  public readonly mimeType: string;

  private static readonly base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  private static readonly dataUrlRegex = /^data:(.*);base64,(.*)$/;

  constructor(input: string) {
    if (typeof input !== 'string' || !input.trim()) {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.REQUIRED);
    }

    const trimmed = input.trim();

    const match = trimmed.match(Base64Image.dataUrlRegex);

    if (match) {
      this.mimeType = match[1];
      this.value = match[2];
    } else {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.INVALID);
    }

    if (this.value.length % 4 !== 0) {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4);
    }

    if (!Base64Image.base64Regex.test(this.value)) {
      throw new BadRequestException(ValidationErrorMessages.BASE64_IMAGE.INVALID);
    }
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
