import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { Uuid } from '../../../src/common/value-objects/uuid.vo';

describe('Uuid', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('Valid UUID', () => {
    it('should create instance with valid UUID', () => {
      const instance = new Uuid(validUuid);
      expect(instance.value).toBe(validUuid);
      expect(instance.toString()).toBe(validUuid);
    });
  });

  describe('Invalid UUID values', () => {
    it.each([
      [null, ValidationErrorMessages.UUID.REQUIRED],
      [undefined, ValidationErrorMessages.UUID.REQUIRED],
      ['', ValidationErrorMessages.UUID.REQUIRED],
    ])('should throw REQUIRED error for %p', (value, expectedMessage) => {
      expect(() => new Uuid(value)).toThrow(BadRequestException);
      expect(() => new Uuid(value)).toThrow(expectedMessage);
    });

    it('should throw MUST_BE_STRING error for non-string', () => {
      const invalidValue = 123;
      expect(() => new Uuid(invalidValue)).toThrow(BadRequestException);
      expect(() => new Uuid(invalidValue)).toThrow(ValidationErrorMessages.UUID.MUST_BE_STRING);
    });

    it('should throw INVALID_TYPE error for malformed UUID string', () => {
      const invalidUuid = 'invalid-uuid';
      expect(() => new Uuid(invalidUuid)).toThrow(BadRequestException);
      expect(() => new Uuid(invalidUuid)).toThrow(
        ValidationErrorMessages.UUID.INVALID_TYPE(invalidUuid),
      );
    });
  });

  describe('Behavior', () => {
    it('toString should return the UUID string', () => {
      const instance = new Uuid(validUuid);
      expect(instance.toString()).toBe(validUuid);
    });

    it('value getter should return the UUID string', () => {
      const instance = new Uuid(validUuid);
      expect(instance.value).toBe(validUuid);
    });
  });
});
