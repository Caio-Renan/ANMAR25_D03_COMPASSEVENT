import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { Password } from '../../../src/common/value-objects/password.vo';

describe('Password VO', () => {
  it('should throw if password is not a string', () => {
    const invalidValues = [null, undefined, 12345678, true, {}, [], Symbol('abc')];

    invalidValues.forEach(value => {
      expect(() => new Password(value as any)).toThrow(BadRequestException);
      expect(() => new Password(value as any)).toThrow(
        ValidationErrorMessages.PASSWORD.INVALID_TYPE,
      );
    });
  });

  it('should throw if password is empty string', () => {
    expect(() => new Password('')).toThrow(BadRequestException);
    expect(() => new Password('')).toThrow(ValidationErrorMessages.PASSWORD.REQUIRED);
  });

  it('should throw if password contains spaces', () => {
    const invalidValues = [' ', '  ', ' abc123', 'abc1234 ', 'abc 12345'];

    invalidValues.forEach(value => {
      expect(() => new Password(value)).toThrow(BadRequestException);
      expect(() => new Password(value)).toThrow(ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED);
    });
  });

  it(`should throw if password length is less than ${Password.minLength}`, () => {
    const shortPassword = 'a1b2c';
    expect(() => new Password(shortPassword)).toThrow(BadRequestException);
    expect(() => new Password(shortPassword)).toThrow(
      ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );
  });

  it(`should throw if password length is greater than ${Password.maxLength}`, () => {
    const longPassword = 'A1'.repeat(Math.ceil(Password.maxLength / 2)) + 'A';
    expect(() => new Password(longPassword)).toThrow(BadRequestException);
    expect(() => new Password(longPassword)).toThrow(
      ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );
  });

  it('should throw if password does not contain both letters and numbers', () => {
    const invalidPasswords = ['abcdefgh', '12345678', '!!!@@@###'];

    invalidPasswords.forEach(password => {
      expect(() => new Password(password)).toThrow(BadRequestException);
      expect(() => new Password(password)).toThrow(
        ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS,
      );
    });
  });

  it('should accept valid passwords', () => {
    const validPasswords = ['abc12345', 'AbC98765', 'Test1234', 'a1b2c3d4'];

    validPasswords.forEach(password => {
      const instance = new Password(password);
      expect(instance.value).toBe(password);
      expect(instance.toString()).toBe(password);
    });
  });

  it('should validate using isValid and getValidationError', () => {
    expect(Password.isValid('abc12345')).toBe(true);
    expect(Password.isValid('12345678')).toBe(false);
    expect(Password.getValidationError('12345678')).toBe(
      ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS,
    );
    expect(Password.getValidationError('abc12345')).toBeNull();
  });
});
