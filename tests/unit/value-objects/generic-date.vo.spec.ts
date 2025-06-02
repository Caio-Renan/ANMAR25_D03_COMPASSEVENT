import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { GenericDate } from '../../../src/common/value-objects/generic-date.vo';

describe('GenericDate', () => {
  describe('Invalid types', () => {
    const invalidTypes = [true, false, null, undefined, {}, [], () => {}];

    invalidTypes.forEach(value => {
      it(`should throw if value is of invalid type (${typeof value})`, () => {
        expect(() => new GenericDate(value as any)).toThrow(BadRequestException);
        expect(() => new GenericDate(value as any)).toThrow(
          ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE,
        );
      });
    });
  });

  describe('Invalid date values', () => {
    it('should throw if value is an invalid date string', () => {
      const invalidDateString = 'not-a-date';
      expect(() => new GenericDate(invalidDateString)).toThrow(BadRequestException);
      expect(() => new GenericDate(invalidDateString)).toThrow(
        ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(invalidDateString),
      );
    });

    it('should throw if date is invalid timestamp (NaN)', () => {
      const invalidTimestamp = NaN;
      expect(() => new GenericDate(invalidTimestamp as any)).toThrow(BadRequestException);
      expect(() => new GenericDate(invalidTimestamp as any)).toThrow(
        ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(invalidTimestamp),
      );
    });

    it('should throw if date is invalid empty string', () => {
      expect(() => new GenericDate('')).toThrow(BadRequestException);
      expect(() => new GenericDate('')).toThrow(
        ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(''),
      );
    });
  });

  describe('Valid dates', () => {
    it('should accept valid Date object', () => {
      const date = new Date();
      const instance = new GenericDate(date);
      expect(instance.value.getTime()).toBe(date.getTime());
      expect(instance.toISOString()).toBe(date.toISOString());
      expect(instance.toString()).toBe(date.toISOString());
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

    it('getter should return a new Date instance with same time', () => {
      const date = new Date();
      const instance = new GenericDate(date);
      const value1 = instance.value;
      const value2 = instance.value;
      expect(value1).not.toBe(value2);
      expect(value1.getTime()).toBe(value2.getTime());
    });

    it('toString should return ISO string', () => {
      const date = new Date('2025-01-01T12:00:00Z');
      const instance = new GenericDate(date);
      expect(instance.toString()).toBe(date.toISOString());
    });
  });
});
