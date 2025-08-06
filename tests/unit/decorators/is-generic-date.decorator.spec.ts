import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { IsGenericDate } from '@decorators/is-generic-date.decorator';
import * as genericDateUtils from '@decorators/utils/generic-date.util';
import { validate } from 'class-validator';

describe('IsGenericDate Decorator - Utils Functions', () => {
  const { trimDateInput, isValidDate, getDateValidationError } = genericDateUtils.genericDateUtils;

  describe('trimDateInput', () => {
    it.each([
      ['string with spaces', ' 2023-01-01 ', '2023-01-01'],
      ['number value', 1685260800000, 1685260800000],
      ['Date instance', new Date(), (val: unknown) => val instanceof Date],
      ['other types', true, true],
      ['null', null, null],
      ['undefined', undefined, undefined],
    ])('should handle %s', (_, input, expected) => {
      const result = trimDateInput(input);
      if (typeof expected === 'function') {
        expect(expected(result)).toBe(true);
      } else {
        expect(result).toBe(expected);
      }
    });
  });

  describe('isValidDate', () => {
    it.each([
      ['valid Date object', new Date(), true],
      ['valid date string', '2023-01-01T00:00:00.000Z', true],
      ['valid timestamp number', 1685260800000, true],
      ['invalid date string', 'invalid-date', false],
      ['NaN', NaN, false],
      ['invalid types: true', true, false],
      ['invalid types: null', null, false],
      ['invalid types: undefined', undefined, false],
    ])('should return %p for %s', (_, input, expected) => {
      expect(isValidDate(input)).toBe(expected);
    });
  });

  describe('getDateValidationError', () => {
    it.each([
      ['non-date boolean', true, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
      ['non-date null', null, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
      ['non-date undefined', undefined, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
      [
        'invalid date string',
        'invalid-date',
        ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE('invalid-date'),
      ],
      ['NaN value', NaN, ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(NaN)],
    ])('should return %p for %s', (_, input, expected) => {
      expect(getDateValidationError(input)).toBe(expected);
    });

    it('should return null for valid dates', () => {
      expect(getDateValidationError(new Date())).toBeNull();
      expect(getDateValidationError('2023-01-01T00:00:00.000Z')).toBeNull();
      expect(getDateValidationError(1685260800000)).toBeNull();
    });
  });

  describe('genericDateValidator.defaultMessage coverage', () => {
    it('returns fallback message when getDateValidationError returns null', () => {
      const spy = jest
        .spyOn(genericDateUtils.genericDateUtils, 'getDateValidationError')
        .mockReturnValueOnce(null);
      const fakeArgs = { value: 'any-value' } as any;
      const message = genericDateUtils.genericDateValidator.defaultMessage(fakeArgs);
      expect(message).toBe(ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE);
      spy.mockRestore();
    });
  });
});

describe('IsGenericDate Decorator - Integration Validation', () => {
  class TestDto {
    @IsGenericDate()
    date!: unknown;
  }

  describe('Invalid types', () => {
    it.each([
      [true, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
      [false, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
      [null, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
      [undefined, ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE],
    ])('invalidates non Date/string/number: %p', async (value, expectedMessage) => {
      const dto = new TestDto();
      dto.date = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty('isGenericDate', expectedMessage);
    });
  });

  describe('Invalid values', () => {
    it.each([
      ['not-a-date', ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE('not-a-date')],
      [NaN, ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(NaN)],
    ])('invalidates invalid date value: %p', async (value, expectedMessage) => {
      const dto = new TestDto();
      dto.date = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty('isGenericDate', expectedMessage);
    });
  });

  describe('Valid values', () => {
    it.each([
      [new Date(), 'Date object'],
      ['2023-01-01T00:00:00.000Z', 'date string'],
      [1685260800000, 'timestamp number'],
    ])('validates valid %s without errors', async (value, _description) => {
      const dto = new TestDto();
      dto.date = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
