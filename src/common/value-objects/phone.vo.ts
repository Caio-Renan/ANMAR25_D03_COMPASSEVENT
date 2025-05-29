import { BadRequestException } from '@nestjs/common';

export class Phone {
  private readonly _value: string;

  constructor(phone: string) {
    if (!phone || !phone.trim()) {
      throw new BadRequestException('Phone number is required.');
    }

    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');

    if (![10, 11, 13].includes(digits.length)) {
      throw new BadRequestException('Invalid phone number format.');
    }

    let ddi = '+55';
    let ddd = '';
    let main = '';

    if (digits.length === 13 && digits.startsWith('55')) {
      ddd = digits.slice(2, 4);
      main = digits.slice(4);
    } else if (digits.length === 11 || digits.length === 10) {
      ddd = digits.slice(0, 2);
      main = digits.slice(2);
    } else {
      throw new BadRequestException('Invalid phone number format.');
    }

    const isMobile = main.length === 9;

    const prefix = isMobile ? main.slice(0, 5) : main.slice(0, 4);
    const suffix = isMobile ? main.slice(5) : main.slice(4);

    this._value = `${ddi} (${ddd}) ${prefix}-${suffix}`;
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }
}
