import { BadRequestException } from '@nestjs/common';
import { GenericString } from '../../../src/common/value-objects/generic-string.vo';
import { ValueObjectErrorMessages } from '../../../src/common/constants/error-messages/value-object-error-messages';

describe('GenericString', () => {
  it('should throw if value is not a string and not null/undefined', () => {
    const invalidValues = [123, true, {}, [], () => {}];

    invalidValues.forEach(value => {
      expect(() => new GenericString(value as any)).toThrow(BadRequestException);
      expect(() => new GenericString(value as any)).toThrow(
        ValueObjectErrorMessages.GENERIC_STRING.REQUIRED,
      );
    });
  });

  it('should throw if value is null, undefined, or empty after trim', () => {
    const invalidValues = [null, undefined, '', '    '];

    invalidValues.forEach(value => {
      expect(() => new GenericString(value as any)).toThrow(BadRequestException);
      expect(() => new GenericString(value as any)).toThrow(
        ValueObjectErrorMessages.GENERIC_STRING.NOT_EMPTY,
      );
    });
  });

  it('should throw if value length is less than minLength', () => {
    expect(() => new GenericString('a')).toThrow(BadRequestException);
    expect(() => new GenericString('a')).toThrow(
      ValueObjectErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength),
    );

    expect(() => new GenericString('abc')).toThrow(BadRequestException);
    expect(() => new GenericString('abc')).toThrow(
      ValueObjectErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength),
    );
  });

  it('should throw if value length is greater than maxLength', () => {
    const longString = 'a'.repeat(256);
    expect(() => new GenericString(longString)).toThrow(BadRequestException);
    expect(() => new GenericString(longString)).toThrow(
      ValueObjectErrorMessages.GENERIC_STRING.TOO_LONG(GenericString.maxLength),
    );
  });

  it('should accept valid string and trim whitespace', () => {
    const value = '  hello world  ';
    const instance = new GenericString(value);
    expect(instance.value).toBe('hello world');
    expect(instance.toString()).toBe('hello world');
  });
});
