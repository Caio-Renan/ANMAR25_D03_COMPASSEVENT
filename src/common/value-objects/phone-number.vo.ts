import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { BadRequestException } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export class PhoneNumber {
  private readonly phone: string;

  constructor(phone: string) {
    if (!phone || typeof phone !== 'string') {
      throw new BadRequestException(ValidationErrorMessages.PHONE_NUMBER.REQUIRED);
    }

    if (!phone.startsWith('+')) {
      throw new BadRequestException(ValidationErrorMessages.PHONE_NUMBER.MUST_START_WITH_PLUS);
    }

    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new BadRequestException(ValidationErrorMessages.PHONE_NUMBER.INVALID_TYPE);
    }

    this.phone = phoneNumber.number;
  }

  public get value(): string {
    return this.phone;
  }

  public toString(): string {
    return this.value;
  }
}
