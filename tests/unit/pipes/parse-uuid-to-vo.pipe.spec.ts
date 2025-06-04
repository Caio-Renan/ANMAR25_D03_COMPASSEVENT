import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { ParseUuidToValueObjectPipe } from '../../../src/common/pipes/parse-uuid-to-vo.pipe';

describe('ParseUuidToValueObjectPipe', () => {
  let pipe: ParseUuidToValueObjectPipe;

  beforeEach(() => {
    pipe = new ParseUuidToValueObjectPipe();
  });

  it('should return value if it is a valid UUID', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(pipe.transform(validUuid)).toBe(validUuid);
  });

  it('should throw BadRequestException for empty string', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
    expect(() => pipe.transform('')).toThrow(ValidationErrorMessages.UUID.REQUIRED);
  });

  it('should throw BadRequestException for undefined', () => {
    expect(() => pipe.transform(undefined as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(undefined as any)).toThrow(ValidationErrorMessages.UUID.REQUIRED);
  });

  it('should throw BadRequestException for null', () => {
    expect(() => pipe.transform(null as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(null as any)).toThrow(ValidationErrorMessages.UUID.REQUIRED);
  });

  it('should throw BadRequestException for invalid UUID format', () => {
    const invalidUuid = 'not-a-valid-uuid';
    expect(() => pipe.transform(invalidUuid)).toThrow(BadRequestException);
    expect(() => pipe.transform(invalidUuid)).toThrow(
      ValidationErrorMessages.UUID.INVALID_TYPE(invalidUuid),
    );
  });

  it('should throw BadRequestException for non-string types', () => {
    expect(() => pipe.transform(123 as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(123 as any)).toThrow(ValidationErrorMessages.UUID.MUST_BE_STRING);
  });
});
