import { BadRequestException } from '@nestjs/common';
import { GenericString } from '../../../src/common/value-objects/generic-string.vo';

describe('GenericString', () => {
  it('should throw if value is not a string and not null/undefined', () => {
    expect(() => new GenericString(123 as any)).toThrow(BadRequestException);
    expect(() => new GenericString(true as any)).toThrow(BadRequestException);
    expect(() => new GenericString({} as any)).toThrow(BadRequestException);
    expect(() => new GenericString([] as any)).toThrow(BadRequestException);
    expect(() => new GenericString(() => {})).toThrow(BadRequestException);
  });

  it('should throw if value is null or undefined or empty after trim', () => {
    expect(() => new GenericString(null as any)).toThrow(BadRequestException);
    expect(() => new GenericString(undefined as any)).toThrow(BadRequestException);
    expect(() => new GenericString('')).toThrow(BadRequestException);
    expect(() => new GenericString('    ')).toThrow(BadRequestException);
  });

  it('should throw if value length is less than minLength', () => {
    expect(() => new GenericString('a', 2)).toThrow(BadRequestException);
    expect(() => new GenericString('abc', 4)).toThrow('String must be at least 4 characters long.');
  });

  it('should throw if value length is greater than maxLength', () => {
    const longString = 'a'.repeat(256);
    expect(() => new GenericString(longString, 1, 255)).toThrow(BadRequestException);
    expect(() => new GenericString(longString, 1, 255)).toThrow(
      'String must be at most 255 characters long.',
    );
  });

  it('should accept valid string and trim whitespace', () => {
    const value = '  hello world  ';
    const instance = new GenericString(value);
    expect(instance.value).toBe('hello world');
    expect(instance.toString()).toBe('hello world');
  });

  it('should accept custom minLength and maxLength', () => {
    expect(() => new GenericString('abc', 1, 3)).not.toThrow();
    expect(() => new GenericString('abc', 4, 10)).toThrow();
    expect(() => new GenericString('abcdefghij', 1, 5)).toThrow();
  });
});
