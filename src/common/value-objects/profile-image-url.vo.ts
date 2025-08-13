import { BadRequestException } from '@nestjs/common';

export class ProfileImageUrl {
  public readonly value: string;

  constructor(value: string) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException('Invalid profile image URL');
    }
    this.value = value.trim();
  }
}
