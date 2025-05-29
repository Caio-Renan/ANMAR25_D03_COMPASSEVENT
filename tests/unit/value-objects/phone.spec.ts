import { BadRequestException } from '@nestjs/common';
import { Phone } from '../../../src/common/value-objects/phone.vo';

describe('Phone', () => {
  it('should create a valid phone number with 11 digits', () => {
    const phone = new Phone('11912345678');
    expect(phone.value).toBe('+55 (11) 91234-5678');
  });

  it('should create a valid phone number with 10 digits', () => {
    const phone = new Phone('1134567890');
    expect(phone.value).toBe('+55 (11) 3456-7890');
  });

  it('should create a valid phone with DDI (13 digits)', () => {
    const phone = new Phone('5511912345678');
    expect(phone.value).toBe('+55 (11) 91234-5678');
  });

  it('should remove special characters and format correctly', () => {
    const phone = new Phone('(11) 91234-5678');
    expect(phone.value).toBe('+55 (11) 91234-5678');
  });

  it('should throw if phone is empty', () => {
    expect(() => new Phone('')).toThrow(BadRequestException);
    expect(() => new Phone('')).toThrow('Phone number is required.');
  });

  it('should throw if phone is only spaces', () => {
    expect(() => new Phone('   ')).toThrow(BadRequestException);
    expect(() => new Phone('   ')).toThrow('Phone number is required.');
  });

  it('should throw if phone has invalid length (less than 10)', () => {
    expect(() => new Phone('12345')).toThrow(BadRequestException);
    expect(() => new Phone('12345')).toThrow('Invalid phone number format.');
  });

  it('should throw if phone has invalid length (too long)', () => {
    expect(() => new Phone('551191234567890')).toThrow(BadRequestException);
    expect(() => new Phone('551191234567890')).toThrow('Invalid phone number format.');
  });

  it('toString should return the same as value', () => {
    const phone = new Phone('11912345678');
    expect(phone.toString()).toBe(phone.value);
  });
});
