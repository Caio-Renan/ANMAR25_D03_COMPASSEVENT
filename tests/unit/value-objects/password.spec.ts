import { BadRequestException } from '@nestjs/common';
import { Password } from '../../../src/common/value-objects/password.vo';

describe('Password', () => {
  it('should throw if password is not a string', () => {
    expect(() => new Password(null as any)).toThrow(BadRequestException);
    expect(() => new Password(undefined as any)).toThrow(BadRequestException);
    expect(() => new Password(12345678 as any)).toThrow(BadRequestException);
    expect(() => new Password(true as any)).toThrow(BadRequestException);
    expect(() => new Password({} as any)).toThrow(BadRequestException);
  });

  it('should throw if password is empty or only spaces', () => {
    expect(() => new Password('')).toThrow(BadRequestException);
    expect(() => new Password('    ')).toThrow(BadRequestException);
  });

  it('should throw if password length is less than 8 or greater than 64', () => {
    expect(() => new Password('abc123')).toThrow(BadRequestException);
    expect(() => new Password('a'.repeat(65) + '1')).toThrow(BadRequestException);
  });

  it('should throw if password contains spaces inside', () => {
    expect(() => new Password('abc 1234')).toThrow(BadRequestException);
  });

  it('should throw if password does not contain both letters and numbers', () => {
    expect(() => new Password('abcdefgh')).toThrow(BadRequestException);
    expect(() => new Password('12345678')).toThrow(BadRequestException);
    expect(() => new Password('!!!@@@###')).toThrow(BadRequestException);
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
