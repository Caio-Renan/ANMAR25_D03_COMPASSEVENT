import { PhoneNumber } from '../../../src/common/value-objects/phone-number.vo';
import { BadRequestException } from '@nestjs/common';
import { ValueObjectErrorMessages } from '../../../src/common/constants/error-messages/value-object-error-messages';

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
      const phoneVO = new PhoneNumber(phone);
      expect(phoneVO.value()).toBe(phone);
    });
  });

  it('should throw if phone number is empty', () => {
    expect(() => new PhoneNumber('')).toThrow(BadRequestException);
    expect(() => new PhoneNumber('')).toThrow(ValueObjectErrorMessages.PHONE_NUMBER.REQUIRED);
  });

  it('should throw if phone number does not start with +', () => {
    expect(() => new PhoneNumber('5511999998888')).toThrow(BadRequestException);
    expect(() => new PhoneNumber('5511999998888')).toThrow(
      ValueObjectErrorMessages.PHONE_NUMBER.MUST_START_WITH_PLUS,
    );
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
      expect(() => new PhoneNumber(phone)).toThrow(BadRequestException);
      expect(() => new PhoneNumber(phone)).toThrow(
        ValueObjectErrorMessages.PHONE_NUMBER.INVALID_TYPE,
      );
    });
  });

  it('toString should return the same as value', () => {
    const phone = new PhoneNumber('+5511999998888');
    expect(phone.toString()).toBe(phone.value());
  });
});
