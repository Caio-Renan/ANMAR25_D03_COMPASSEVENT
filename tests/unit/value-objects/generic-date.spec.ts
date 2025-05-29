import { BadRequestException } from '@nestjs/common';
import { GenericDate } from '../../../src/common/value-objects/generic-date.vo';
import { ValueObjectErrorMessages } from '../../../src/common/constants/error-messages/value-object-error-messages';

describe('GenericDate', () => {
  it('should throw if value is boolean', () => {
    expect(() => new GenericDate(true as any)).toThrow(BadRequestException);
    expect(() => new GenericDate(true as any)).toThrow(ValueObjectErrorMessages.DATE.INVALID_TYPE);

    expect(() => new GenericDate(false as any)).toThrow(BadRequestException);
    expect(() => new GenericDate(false as any)).toThrow(ValueObjectErrorMessages.DATE.INVALID_TYPE);
  });

  it('should throw if value is null or undefined', () => {
    expect(() => new GenericDate(null as any)).toThrow(BadRequestException);
    expect(() => new GenericDate(null as any)).toThrow(ValueObjectErrorMessages.DATE.INVALID_TYPE);

    expect(() => new GenericDate(undefined as any)).toThrow(BadRequestException);
    expect(() => new GenericDate(undefined as any)).toThrow(
      ValueObjectErrorMessages.DATE.INVALID_TYPE,
    );
  });

  it('should throw if value is an invalid date string', () => {
    expect(() => new GenericDate('not-a-date')).toThrow(BadRequestException);
    expect(() => new GenericDate('not-a-date')).toThrow(
      ValueObjectErrorMessages.DATE.INVALID_VALUE('not-a-date'),
    );
  });

  it('should accept valid Date object', () => {
    const date = new Date();
    const instance = new GenericDate(date);
    expect(instance.value.getTime()).toBe(date.getTime());
    expect(instance.toISOString()).toBe(date.toISOString());
  });

  it('should accept valid date string', () => {
    const dateString = '2023-01-01T00:00:00.000Z';
    const instance = new GenericDate(dateString);
    expect(instance.value.toISOString()).toBe(dateString);
  });

  it('should accept valid timestamp number', () => {
    const timestamp = 1685260800000;
    const instance = new GenericDate(timestamp);
    expect(instance.value.getTime()).toBe(timestamp);
  });

  it('should return a new Date instance from getter', () => {
    const date = new Date();
    const instance = new GenericDate(date);
    const value1 = instance.value;
    const value2 = instance.value;
    expect(value1).not.toBe(value2);
    expect(value1.getTime()).toBe(value2.getTime());
  });
});
