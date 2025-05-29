import { BadRequestException } from '@nestjs/common';
import { Password } from '../../../src/common/value-objects/password.vo';
import { ValueObjectErrorMessages } from '../../../src/common/constants/error-messages/value-object-error-messages';

describe('Password', () => {
  it('should throw if password is not a string', () => {
    const invalidValues = [null, undefined, 12345678, true, {}];

    invalidValues.forEach(value => {
      expect(() => new Password(value as any)).toThrow(BadRequestException);
      expect(() => new Password(value as any)).toThrow(
        ValueObjectErrorMessages.PASSWORD.INVALID_TYPE,
      );
    });
  });

  it('should throw if password is empty or only spaces', () => {
    const invalidValues = ['', '    '];

    invalidValues.forEach(value => {
      expect(() => new Password(value)).toThrow(BadRequestException);
      expect(() => new Password(value)).toThrow(ValueObjectErrorMessages.PASSWORD.REQUIRED);
    });
  });

  it('should throw if password length is less than 8', () => {
    const shortPassword = 'abc123';
    expect(() => new Password(shortPassword)).toThrow(BadRequestException);
    expect(() => new Password(shortPassword)).toThrow(
      ValueObjectErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );
  });

  it('should throw if password length is greater than 64', () => {
    const longPassword = 'a'.repeat(65) + '1';
    expect(() => new Password(longPassword)).toThrow(BadRequestException);
    expect(() => new Password(longPassword)).toThrow(
      ValueObjectErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );
  });

  it('should throw if password contains spaces inside', () => {
    const passwordWithSpacesInside = 'abc 1234';
    expect(() => new Password(passwordWithSpacesInside)).toThrow(BadRequestException);
    expect(() => new Password(passwordWithSpacesInside)).toThrow(
      ValueObjectErrorMessages.PASSWORD.NO_SPACES_ALLOWED,
    );
  });

  it('should throw if password does not contain both letters and numbers', () => {
    const invalidPasswords = ['abcdefgh', '12345678', '!!!@@@###'];

    invalidPasswords.forEach(password => {
      expect(() => new Password(password)).toThrow(BadRequestException);
      expect(() => new Password(password)).toThrow(
        ValueObjectErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS,
      );
    });
  });

  it('should accept a valid password', () => {
    const validPassword = 'abc12345';
    const instance = new Password(validPassword);
    expect(instance.value).toBe(validPassword);
    expect(instance.toString()).toBe(validPassword);
  });

  it('should trim whitespace from password', () => {
    const passwordWithSpaces = '   abc12345   ';
    const instance = new Password(passwordWithSpaces);
    expect(instance.value).toBe('abc12345');
  });
});
