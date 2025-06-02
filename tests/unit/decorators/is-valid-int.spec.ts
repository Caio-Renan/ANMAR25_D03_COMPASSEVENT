import { validate } from 'class-validator';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { IsValidInt } from '../../../src/common/decorators/is-valid-int.decorator';
import * as intUtil from '../../../src/common/decorators/utils/valid-int.util';

class TestDto {
  @IsValidInt()
  value!: unknown;
}

describe('IsValidInt Decorator', () => {
  describe('Decorator Validation', () => {
    const dto = new TestDto();

    it.each([
      ['', ValidationErrorMessages.VALID_INT.NOT_A_NUMBER('')],
      ['abc', ValidationErrorMessages.VALID_INT.NOT_A_NUMBER('abc')],
    ])('should invalidate invalid non-numeric string: %p', async (input, expectedMessage) => {
      dto.value = input;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isValidInt', expectedMessage);
    });

    it('should invalidate non-integer number', async () => {
      dto.value = 1.5;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidInt',
        ValidationErrorMessages.VALID_INT.NOT_A_INTEGER(1.5),
      );
    });

    it('should invalidate integers less than 1', async () => {
      dto.value = 0;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidInt',
        ValidationErrorMessages.VALID_INT.TOO_SMALL(0),
      );
    });

    it('should invalidate integers greater than Number.MAX_SAFE_INTEGER', async () => {
      const tooBig = Number.MAX_SAFE_INTEGER + 1;
      dto.value = tooBig;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidInt',
        ValidationErrorMessages.VALID_INT.TOO_LARGE(tooBig),
      );
    });

    it.each([42, '123'])('should validate valid integer value: %p', async validValue => {
      dto.value = validValue;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should return fallback message when getIntValidationError returns null', async () => {
      const spy = jest
        .spyOn(intUtil.validIntUtils, 'getIntValidationError')
        .mockReturnValueOnce(null);

      dto.value = 'invalid';
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidInt',
        ValidationErrorMessages.VALID_INT.NOT_A_NUMBER('invalid'),
      );

      spy.mockRestore();
    });
  });

  describe('ValidInt Utility Functions', () => {
    const { isValidInt, getIntValidationError } = intUtil.validIntUtils;

    describe('isValidInt', () => {
      it.each([
        [5, true],
        ['5', true],
        [0, false],
        [-1, false],
        ['-10', false],
        [1.5, false],
        ['2.7', false],
        [NaN, false],
        ['abc', false],
        [{}, false],
        [null, false],
        [undefined, false],
        [Number.MAX_SAFE_INTEGER + 1, false],
      ])('should return %p for isValidInt(%p)', (input, expected) => {
        expect(isValidInt(input)).toBe(expected);
      });
    });

    describe('getIntValidationError', () => {
      it.each([
        ['', ValidationErrorMessages.VALID_INT.NOT_A_NUMBER('')],
        ['abc', ValidationErrorMessages.VALID_INT.NOT_A_NUMBER('abc')],
        [{}, ValidationErrorMessages.VALID_INT.NOT_A_NUMBER({})],
        [1.5, ValidationErrorMessages.VALID_INT.NOT_A_INTEGER(1.5)],
        ['2.5', ValidationErrorMessages.VALID_INT.NOT_A_INTEGER('2.5')],
        [0, ValidationErrorMessages.VALID_INT.TOO_SMALL(0)],
        [-10, ValidationErrorMessages.VALID_INT.TOO_SMALL(-10)],
        [
          Number.MAX_SAFE_INTEGER + 1,
          ValidationErrorMessages.VALID_INT.TOO_LARGE(Number.MAX_SAFE_INTEGER + 1),
        ],
      ])('should return correct error message for %p', (input, expected) => {
        expect(getIntValidationError(input)).toBe(expected);
      });

      it.each([10, '10'])('should return null for valid integer %p', validInput => {
        expect(getIntValidationError(validInput)).toBeNull();
      });
    });
  });
});
