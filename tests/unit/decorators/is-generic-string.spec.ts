import { validate } from 'class-validator';
import { IsGenericString } from '../../../src/common/decorators/is-generic-string.decorator';
import { GenericString } from '../../../src/common/value-objects/generic-string.vo';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsGenericString()
  genericString!: unknown;
}

describe('IsGenericString Decorator', () => {
  it('should invalidate non-string non-null/undefined values', async () => {
    const dto = new TestDto();
    const invalidValues = [123, true, {}, [], () => {}];

    for (const value of invalidValues) {
      dto.genericString = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isGenericString',
        ValidationErrorMessages.GENERIC_STRING.REQUIRED,
      );
    }
  });

  it('should invalidate null, undefined or empty (trimmed) strings', async () => {
    const dto = new TestDto();
    const invalidValues = [null, undefined, '', '    '];

    for (const value of invalidValues) {
      dto.genericString = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isGenericString',
        ValidationErrorMessages.GENERIC_STRING.NOT_EMPTY,
      );
    }
  });

  it('should invalidate strings shorter than minLength', async () => {
    const dto = new TestDto();
    const shortStrings = ['a', 'abc'];

    for (const str of shortStrings) {
      dto.genericString = str;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isGenericString',
        ValidationErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength),
      );
    }
  });

  it('should invalidate strings longer than maxLength', async () => {
    const dto = new TestDto();
    const longString = 'a'.repeat(GenericString.maxLength) + 1;

    dto.genericString = longString;
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericString',
      ValidationErrorMessages.GENERIC_STRING.TOO_LONG(GenericString.maxLength),
    );
  });

  it('should validate valid strings with trimming', async () => {
    const dto = new TestDto();
    dto.genericString = '  hello world  ';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
