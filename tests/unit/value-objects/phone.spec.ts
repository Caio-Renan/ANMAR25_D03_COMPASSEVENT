import { Phone } from '../../../src/common/value-objects/phone.vo';
import { BadRequestException } from '@nestjs/common';

describe('Phone (International)', () => {
  it('should create valid phone numbers in international formats', () => {
    const validPhones = [
      '+5511999998888',
      '+14155552671',
      '+442071838750',
      '+81312345678',
      '+61234567890',
    ];

    validPhones.forEach(phone => {
      const phoneVO = new Phone(phone);
      expect(phoneVO.value()).toBe(phone);
    });
  });

  it('should throw if phone number is empty', () => {
    expect(() => new Phone('')).toThrow(BadRequestException);
    expect(() => new Phone('')).toThrow('Phone number is required.');
  });

  it('should throw if phone number does not start with +', () => {
    expect(() => new Phone('5511999998888')).toThrow(BadRequestException);
    expect(() => new Phone('5511999998888')).toThrow('Phone number must start with "+".');
  });

  it('should throw if phone number is invalid', () => {
    const invalidPhones = [
      '+123',
      '++5511999998888',
      '+5511abc99998888',
      '+999999999999999999999',
      '+phone12345',
      '+999999999',
    ];

    invalidPhones.forEach(phone => {
      expect(() => new Phone(phone)).toThrow(BadRequestException);
      expect(() => new Phone(phone)).toThrow('Invalid phone number format.');
    });
  });

  it('toString should return the same as value', () => {
    const phone = new Phone('+5511999998888');
    expect(phone.toString()).toBe(phone.value());
  });
});
