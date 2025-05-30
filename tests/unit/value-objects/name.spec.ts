import { BadRequestException } from '@nestjs/common';
import { Name } from '../../../src/common/value-objects/name.vo';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

describe('Name', () => {
  it('should throw if name is not a string', () => {
    const invalidValues = [null, undefined, 123, true, {}];

    invalidValues.forEach(value => {
      expect(() => new Name(value as any)).toThrow(BadRequestException);
      expect(() => new Name(value as any)).toThrow(ValidationErrorMessages.NAME.INVALID_TYPE);
    });
  });

  it('should throw if name is empty or only spaces', () => {
    const invalidValues = ['', '    '];

    invalidValues.forEach(value => {
      expect(() => new Name(value)).toThrow(BadRequestException);
      expect(() => new Name(value)).toThrow(ValidationErrorMessages.NAME.REQUIRED);
    });
  });

  it(`should throw if name is longer than ${Name.maxLength} characters`, () => {
    const longName = 'a'.repeat(Name.maxLength) + 1;
    expect(() => new Name(longName)).toThrow(BadRequestException);
    expect(() => new Name(longName)).toThrow(ValidationErrorMessages.NAME.TOO_LONG(Name.maxLength));
  });

  it('should throw if name contains invalid characters', () => {
    const invalidNames = ['John123', 'John@Doe', 'Jane_Doe', 'Name!'];

    invalidNames.forEach(name => {
      expect(() => new Name(name)).toThrow(BadRequestException);
      expect(() => new Name(name)).toThrow(ValidationErrorMessages.NAME.INVALID_CHARACTERS);
    });
  });

  it('should accept valid names and normalize spaces', () => {
    const rawName = '  João   da Silva   ';
    const instance = new Name(rawName);
    expect(instance.value).toBe('João da Silva');
    expect(instance.toString()).toBe('João da Silva');
  });

  it('should accept names with apostrophes, dots and hyphens', () => {
    const validNames = ["O'Connor", 'Anne-Marie', 'Dr. John Smith', "D'Arcy", 'Jean-Luc Picard'];

    validNames.forEach(name => {
      expect(() => new Name(name)).not.toThrow();
    });
  });
});
