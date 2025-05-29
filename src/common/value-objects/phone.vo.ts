import { BadRequestException } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ValueObjectErrorMessages } from '../constants/error-messages/value-object-error-messages';

export class PhoneNumber {
  private readonly phone: string;

  constructor(phone: string) {
    if (!phone || typeof phone !== 'string') {
      throw new BadRequestException(ValueObjectErrorMessages.PHONE_NUMBER.REQUIRED);
    }

    if (!phone.startsWith('+')) {
      throw new BadRequestException(ValueObjectErrorMessages.PHONE_NUMBER.MUST_START_WITH_PLUS);
    }

    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new BadRequestException(ValueObjectErrorMessages.PHONE_NUMBER.INVALID_TYPE);
    }

    this.phone = phoneNumber.number;
  }

  public value(): string {
    return this.phone;
  }

  public toString(): string {
    return this.value();
  }
}
