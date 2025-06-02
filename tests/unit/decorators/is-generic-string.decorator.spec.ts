import { validate } from 'class-validator';
import { IsGenericString } from 'src/common/decorators/is-generic-string.decorator';
import { GenericString } from 'src/common/value-objects/generic-string.vo';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import * as genericStringUtilss from '../../../src/common/decorators/utils/generic-string.util';

class TestDto {
  @IsGenericString()
  genericString!: unknown;
}

describe('IsGenericString Decorator - Integration Validation', () => {
  const dto = new TestDto();

  it.each([[[123, true, {}, [], () => {}], ValidationErrorMessages.GENERIC_STRING.REQUIRED]])(
    'should invalidate non-string non-null/undefined values: %p',
    async (invalidValues, expectedMessage) => {
      for (const value of invalidValues) {
        dto.genericString = value;
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isGenericString', expectedMessage);
      }
    },
  );

  it.each([[[null, undefined, '', '    '], ValidationErrorMessages.GENERIC_STRING.NOT_EMPTY]])(
    'should invalidate null, undefined or empty (trimmed) strings: %p',
    async (invalidValues, expectedMessage) => {
      for (const value of invalidValues) {
        dto.genericString = value;
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isGenericString', expectedMessage);
      }
    },
  );

  it.each([['a', 'abc']])(
    'should invalidate strings shorter than minLength: %p',
    async shortString => {
      dto.genericString = shortString;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isGenericString',
        ValidationErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength),
      );
    },
  );

  it('should invalidate strings longer than maxLength', async () => {
    const longString = 'a'.repeat(GenericString.maxLength) + 'a';
    dto.genericString = longString;
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericString',
      ValidationErrorMessages.GENERIC_STRING.TOO_LONG(GenericString.maxLength),
    );
  });

  it.each([['  hello world  ', 'valid string with spaces']])(
    'should validate valid strings with trimming: %p',
    async validString => {
      dto.genericString = validString;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    },
  );

  it('should return fallback message when getGenericStringValidationError returns null', () => {
    jest
      .spyOn(genericStringUtilss.genericStringUtils, 'getGenericStringValidationError')
      .mockReturnValueOnce(null);

    const fakeArgs = { value: 'any-value' };
    const message = genericStringUtilss.genericStringValidator.defaultMessage(fakeArgs as any);

    expect(message).toBe(ValidationErrorMessages.GENERIC_STRING.REQUIRED);
  });
});

describe('genericStringUtils.getGenericStringValidationError - Utils Functions', () => {
  it.each([[123, true, {}, [], () => {}]])(
    'should return REQUIRED for invalid types: %p',
    (...invalidValues) => {
      for (const value of invalidValues) {
        expect(genericStringUtilss.genericStringUtils.getGenericStringValidationError(value)).toBe(
          ValidationErrorMessages.GENERIC_STRING.REQUIRED,
        );
      }
    },
  );

  it.each([[null, undefined, '', '    ']])(
    'should return NOT_EMPTY for null, undefined or empty strings: %p',
    (...invalidValues) => {
      for (const value of invalidValues) {
        expect(genericStringUtilss.genericStringUtils.getGenericStringValidationError(value)).toBe(
          ValidationErrorMessages.GENERIC_STRING.NOT_EMPTY,
        );
      }
    },
  );

  it.each([['a', 'ab', 'abc']])(
    `should return TOO_SHORT if string length is less than ${GenericString.minLength}: %p`,
    (...shortStrings) => {
      for (const value of shortStrings) {
        expect(genericStringUtilss.genericStringUtils.getGenericStringValidationError(value)).toBe(
          ValidationErrorMessages.GENERIC_STRING.TOO_SHORT(GenericString.minLength),
        );
      }
    },
  );

  it(`should return TOO_LONG if string length is longer than ${GenericString.maxLength}`, () => {
    const longString = 'a'.repeat(GenericString.maxLength) + 'a';
    const result =
      genericStringUtilss.genericStringUtils.getGenericStringValidationError(longString);
    expect(result).toBe(ValidationErrorMessages.GENERIC_STRING.TOO_LONG(GenericString.maxLength));
  });

  it.each(['Valid string', '   Valid string   '])(
    'should return null for valid strings: %p',
    str => {
      expect(
        genericStringUtilss.genericStringUtils.getGenericStringValidationError(str),
      ).toBeNull();
    },
  );
});
