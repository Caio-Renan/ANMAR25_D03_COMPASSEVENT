import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { ValidInt } from '../../../src/common/value-objects/valid-int.vo';

describe('ValidInt', () => {
  it('should throw if value is not a number', () => {
    const invalidValues = [null, undefined, '', 'abc', {}, [], true, false, NaN];

    invalidValues.forEach(value => {
      expect(() => new ValidInt(value as any)).toThrow(BadRequestException);
      expect(() => new ValidInt(value as any)).toThrow(
        ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(value),
      );
    });
  });

  it('should throw if value is not an integer (float)', () => {
    const invalidValues = [1.1, '2.5', 100.99];

    invalidValues.forEach(value => {
      expect(() => new ValidInt(value as any)).toThrow(BadRequestException);
      expect(() => new ValidInt(value as any)).toThrow(
        ValidationErrorMessages.VALID_INT.NOT_A_INTEGER(value),
      );
    });
  });

  it('should throw if value is less than 1', () => {
    const invalidValues = [0, -1, '-10', -9999];

    invalidValues.forEach(value => {
      expect(() => new ValidInt(value as any)).toThrow(BadRequestException);
      expect(() => new ValidInt(value as any)).toThrow(
        ValidationErrorMessages.VALID_INT.TOO_SMALL(value),
      );
    });
  });

  it('should throw if value is greater than MAX_SAFE_INTEGER', () => {
    const invalidValue = ValidInt.maxLength + 1;

    expect(() => new ValidInt(invalidValue)).toThrow(BadRequestException);
    expect(() => new ValidInt(invalidValue)).toThrow(
      ValidationErrorMessages.VALID_INT.TOO_LARGE(invalidValue),
    );
  });

  it('should accept valid integers as number or string', () => {
    const validValues = [1, '1', 100, '999', ValidInt.maxLength.toString()];

    validValues.forEach(value => {
      const instance = new ValidInt(value as any);
      expect(instance.value).toBe(Number(value));
      expect(instance.number).toBe(Number(value));
      expect(instance.toString()).toBe(String(Number(value)));
    });
  });
});
