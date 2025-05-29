import { BadRequestException } from '@nestjs/common';
import { ValidInt } from '../../../src/common/value-objects/valid-int.vo';
import { ValueObjectErrorMessages } from '../../../src/common/constants/error-messages/value-object-error-messages';

describe('ValidInt', () => {
  it('should throw error if value is NaN', () => {
    expect(() => new ValidInt('abc')).toThrow(BadRequestException);
    expect(() => new ValidInt('abc')).toThrow(
      ValueObjectErrorMessages.VALID_INT.NOT_A_NUMBER('abc'),
    );
  });

  it('should throw error if value is not an integer', () => {
    expect(() => new ValidInt(1.5)).toThrow(BadRequestException);
    expect(() => new ValidInt(1.5)).toThrow(ValueObjectErrorMessages.VALID_INT.NOT_A_INTEGER(1.5));
  });

  it('should throw error if value is less than 1', () => {
    expect(() => new ValidInt(0)).toThrow(BadRequestException);
    expect(() => new ValidInt(0)).toThrow(ValueObjectErrorMessages.VALID_INT.TOO_SMALL(0));
    expect(() => new ValidInt(-5)).toThrow(BadRequestException);
    expect(() => new ValidInt(-5)).toThrow(ValueObjectErrorMessages.VALID_INT.TOO_SMALL(-5));
  });

  it('should throw error if value is greater than Number.MAX_SAFE_INTEGER', () => {
    const tooBig = Number.MAX_SAFE_INTEGER + 1;
    expect(() => new ValidInt(tooBig)).toThrow(BadRequestException);
    expect(() => new ValidInt(tooBig)).toThrow(
      ValueObjectErrorMessages.VALID_INT.TOO_LARGE(tooBig),
    );
  });

  it('should create instance with valid integer value', () => {
    const valid = new ValidInt(100);
    expect(valid.number).toBe(100);
  });

  it('should parse string number correctly', () => {
    const valid = new ValidInt('123');
    expect(valid.number).toBe(123);
  });
});
