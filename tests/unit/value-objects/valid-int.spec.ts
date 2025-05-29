import { BadRequestException } from '@nestjs/common';
import { ValidInt } from '../../../src/common/value-objects/valid-int.vo';

describe('ValidInt', () => {
  it('should throw error if value is NaN', () => {
    expect(() => new ValidInt('abc')).toThrow(BadRequestException);
    expect(() => new ValidInt('abc')).toThrow("Value 'abc' is not a number");
  });

  it('should throw error if value is not an integer', () => {
    expect(() => new ValidInt(1.5)).toThrow(BadRequestException);
    expect(() => new ValidInt(1.5)).toThrow("Value '1.5' must be an integer");
  });

  it('should throw error if value is less than 1', () => {
    expect(() => new ValidInt(0)).toThrow(BadRequestException);
    expect(() => new ValidInt(0)).toThrow("Value '0' must be greater than or equal to 1");
    expect(() => new ValidInt(-5)).toThrow(BadRequestException);
  });

  it('should throw error if value is greater than Number.MAX_SAFE_INTEGER', () => {
    const tooBig = Number.MAX_SAFE_INTEGER + 1;
    expect(() => new ValidInt(tooBig)).toThrow(BadRequestException);
    expect(() => new ValidInt(tooBig)).toThrow(
      `Value '${tooBig}' must be less than or equal to ${Number.MAX_SAFE_INTEGER}`,
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
