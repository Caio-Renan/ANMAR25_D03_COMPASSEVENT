import { validate } from 'class-validator';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { IsBase64Image } from '../../../src/common/decorators/is-base64-image.decorator';
import * as base64Utils from '../../../src/common/decorators/utils/base64-image.util';

describe('IsBase64Image Decorator', () => {
  const validBase64 = 'YWJjZA==';
  const validBase64DataUri = 'data:image/png;base64,YWJjZA==';
  const invalidBase64Length = 'YWJjZA';
  const invalidBase64Chars = 'YWJjZA==*';
  const invalidBase64Padding = 'YWJjZA===';

  describe('Base64 Utils Functions', () => {
    const { extractBase64, isValidBase64, getBase64ValidationError } = base64Utils.base64ImageUtils;

    describe('extractBase64', () => {
      const cases = [
        { input: validBase64, expected: validBase64, desc: 'plain string' },
        { input: validBase64DataUri, expected: validBase64, desc: 'data URI string' },
        { input: `   ${validBase64}   `, expected: validBase64, desc: 'string with whitespaces' },
        { input: validBase64, expected: validBase64, desc: 'string without comma' },
      ];

      cases.forEach(({ input, expected, desc }) =>
        it(`extracts base64 from ${desc}`, () => {
          expect(extractBase64(input)).toBe(expected);
        }),
      );
    });

    describe('isValidBase64', () => {
      const validCases = [validBase64, validBase64DataUri];
      validCases.forEach(input =>
        it(`returns true for valid input: ${input}`, () => {
          expect(isValidBase64(input)).toBe(true);
        }),
      );

      const invalidCases = [
        { input: invalidBase64Length, desc: 'invalid length' },
        { input: invalidBase64Chars, desc: 'invalid characters' },
        { input: invalidBase64Padding, desc: 'incorrect padding' },
        { input: '', desc: 'empty string' },
        { input: '   ', desc: 'only whitespaces' },
      ];
      invalidCases.forEach(({ input, desc }) =>
        it(`returns false for ${desc}`, () => {
          expect(isValidBase64(input)).toBe(false);
        }),
      );
    });

    describe('getBase64ValidationError', () => {
      it('returns REQUIRED for non-string or empty values', () => {
        const requiredMsg = ValidationErrorMessages.BASE64_IMAGE.REQUIRED;
        [undefined, null, 123 as any, '', '   '].forEach(val => {
          expect(getBase64ValidationError(val)).toBe(requiredMsg);
        });
      });

      it('returns LENGTH_MULTIPLE_OF_4 for invalid length with valid chars', () => {
        expect(getBase64ValidationError(invalidBase64Length)).toBe(
          ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4,
        );
      });

      it('returns INVALID for invalid characters', () => {
        expect(getBase64ValidationError(invalidBase64Chars)).toBe(
          ValidationErrorMessages.BASE64_IMAGE.INVALID,
        );
      });

      it('returns null for valid base64 and data URI', () => {
        [validBase64, validBase64DataUri].forEach(val => {
          expect(getBase64ValidationError(val)).toBeNull();
        });
      });
    });
  });

  describe('Decorator Validation', () => {
    class TestDto {
      @IsBase64Image()
      image!: string;
    }

    const errorExpectations = [
      {
        values: ['', '   ', null as any, undefined as any, 123 as any],
        expectedMsg: ValidationErrorMessages.BASE64_IMAGE.REQUIRED,
        description: 'empty or non-string values',
      },
      {
        values: [invalidBase64Length],
        expectedMsg: ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4,
        description: 'valid chars but invalid length',
      },
      {
        values: [invalidBase64Chars],
        expectedMsg: ValidationErrorMessages.BASE64_IMAGE.INVALID,
        description: 'invalid characters',
      },
    ];

    errorExpectations.forEach(({ values, expectedMsg, description }) => {
      it(`returns ${expectedMsg} message for ${description}`, async () => {
        const dto = new TestDto();
        for (const val of values) {
          dto.image = val;
          const [error] = await validate(dto);
          expect(error.constraints?.isBase64Image).toBe(expectedMsg);
        }
      });
    });

    const validCases = [validBase64, validBase64DataUri];
    validCases.forEach(val =>
      it(`validates correct base64 string '${val}' without error`, async () => {
        const dto = new TestDto();
        dto.image = val;
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }),
    );

    it('returns fallback INVALID message when getBase64ValidationError returns null', () => {
      const spy = jest
        .spyOn(base64Utils.base64ImageUtils, 'getBase64ValidationError')
        .mockReturnValueOnce(null);

      const fakeArgs = { value: 'anything' };
      const message = base64Utils.base64ImageValidator.defaultMessage(fakeArgs as any);

      expect(spy).toHaveBeenCalledWith(fakeArgs.value);
      expect(message).toBe(ValidationErrorMessages.BASE64_IMAGE.INVALID);

      spy.mockRestore();
    });
  });
});
