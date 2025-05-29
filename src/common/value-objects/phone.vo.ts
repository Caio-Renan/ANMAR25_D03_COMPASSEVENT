import { BadRequestException } from '@nestjs/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export class Phone {
  private readonly phone: string;

  constructor(phone: string) {
    if (!phone || typeof phone !== 'string') {
      throw new BadRequestException('Phone number is required.');
    }

    if (!phone.startsWith('+')) {
      throw new BadRequestException('Phone number must start with "+".');
    }

    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new BadRequestException('Invalid phone number format.');
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
