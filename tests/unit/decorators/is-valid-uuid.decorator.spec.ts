import { validate, ValidationArguments } from 'class-validator';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { IsValidUuid } from '../../../src/common/decorators/is-valid-uuid.decorator';
import * as uuidUtils from '../../../src/common/decorators/utils/valid-uuid.util';

class TestDto {
  @IsValidUuid()
  id!: unknown;
}

describe('IsValidUuid Decorator', () => {
  describe('Validation behavior', () => {
    const dto = new TestDto();

    it('should validate a valid UUID', async () => {
      dto.id = '123e4567-e89b-12d3-a456-426614174000';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it.each([
      ['', ValidationErrorMessages.UUID.REQUIRED],
      [undefined, ValidationErrorMessages.UUID.REQUIRED],
      [null, ValidationErrorMessages.UUID.REQUIRED],
    ])('should invalidate empty or missing values: %p', async (value, expectedMsg) => {
      dto.id = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isValidUuid', expectedMsg);
    });

    it('should invalidate non-string types', async () => {
      dto.id = 123;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidUuid',
        ValidationErrorMessages.UUID.MUST_BE_STRING,
      );
    });

    it('should invalidate invalid UUID format', async () => {
      const invalidUuid = 'not-a-valid-uuid';
      dto.id = invalidUuid;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidUuid',
        ValidationErrorMessages.UUID.INVALID_TYPE(invalidUuid),
      );
    });

    it('should fallback error message if getUuidValidationError returns null', async () => {
      const spy = jest
        .spyOn(uuidUtils.uuidUtils, 'getUuidValidationError')
        .mockReturnValueOnce(null);

      const invalidUuid = 'invalid-uuid-fallback';
      dto.id = invalidUuid;
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isValidUuid',
        ValidationErrorMessages.UUID.INVALID_TYPE(invalidUuid),
      );

      spy.mockRestore();
    });
  });

  describe('Utility function: getUuidValidationError', () => {
    it('should return null for a valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(uuidUtils.uuidUtils.getUuidValidationError(validUuid)).toBeNull();
    });
  });

  describe('uuidValidator utility', () => {
    describe('validate()', () => {
      it.each([
        ['123e4567-e89b-12d3-a456-426614174000', true],
        ['invalid-uuid', false],
        [1234, false],
      ])('should return %p for validate(%p)', (input, expected) => {
        expect(uuidUtils.uuidValidator.validate(input)).toBe(expected);
      });
    });

    describe('defaultMessage()', () => {
      it('should return custom error message from getUuidValidationError if available', () => {
        const fakeValue = '';
        const fakeArgs = { value: fakeValue } as ValidationArguments;

        const spy = jest
          .spyOn(uuidUtils.uuidUtils, 'getUuidValidationError')
          .mockReturnValueOnce(ValidationErrorMessages.UUID.REQUIRED);

        const result = uuidUtils.uuidValidator.defaultMessage(fakeArgs);

        expect(spy).toHaveBeenCalledWith(fakeValue);
        expect(result).toBe(ValidationErrorMessages.UUID.REQUIRED);

        spy.mockRestore();
      });

      it('should return fallback error message if getUuidValidationError returns null', () => {
        const fakeValue = 'invalid-uuid';
        const fakeArgs = { value: fakeValue } as ValidationArguments;

        const spy = jest
          .spyOn(uuidUtils.uuidUtils, 'getUuidValidationError')
          .mockReturnValueOnce(null);

        const result = uuidUtils.uuidValidator.defaultMessage(fakeArgs);

        expect(spy).toHaveBeenCalledWith(fakeValue);
        expect(result).toBe(ValidationErrorMessages.UUID.INVALID_TYPE(fakeValue));

        spy.mockRestore();
      });
    });
  });
});
