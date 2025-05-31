import { BadRequestException } from '@nestjs/common';

import { PipeErrorMessages } from '../../../src/common/constants/error-messages/pipe-error-messages';
import { ParseUuidPipe } from '../../../src/common/pipes/parse-uuid.pipe';

describe('ParseUuidPipe', () => {
  let pipe: ParseUuidPipe;

  beforeEach(() => {
    pipe = new ParseUuidPipe();
  });

  it('should return value if it is a valid UUID', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(pipe.transform(validUuid)).toBe(validUuid);
  });

  it('should throw BadRequestException for empty string', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
    expect(() => pipe.transform('')).toThrow(PipeErrorMessages.UUID.REQUIRED);
  });

  it('should throw BadRequestException for undefined', () => {
    expect(() => pipe.transform(undefined as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(undefined as any)).toThrow(PipeErrorMessages.UUID.REQUIRED);
  });

  it('should throw BadRequestException for null', () => {
    expect(() => pipe.transform(null as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(null as any)).toThrow(PipeErrorMessages.UUID.REQUIRED);
  });

  it('should throw BadRequestException for invalid UUID format', () => {
    const invalidUuid = 'not-a-valid-uuid';
    expect(() => pipe.transform(invalidUuid)).toThrow(BadRequestException);
    expect(() => pipe.transform(invalidUuid)).toThrow(
      PipeErrorMessages.UUID.INVALID_TYPE(invalidUuid),
    );
  });

  it('should throw BadRequestException for non-string types', () => {
    expect(() => pipe.transform(123 as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(123 as any)).toThrow(PipeErrorMessages.UUID.MUST_BE_STRING);
  });
});
