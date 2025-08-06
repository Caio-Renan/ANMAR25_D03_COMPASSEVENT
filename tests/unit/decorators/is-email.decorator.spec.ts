import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { IsEmail } from '@decorators/is-email.decorator';
import * as emailUtils from '@decorators/utils/email.util';
import { Email } from '@vo/email.vo';
import { validate } from 'class-validator';

describe('IsEmail Decorator', () => {
  const validEmail = 'test@example.com';
  const validEmailWithSpaces = '   test@example.com   ';
  const invalidEmailFormat = 'invalid-email';
  const tooLongEmail = 'a'.repeat(Email.maxLength) + '@example.com';

  describe('Utils Functions', () => {
    const { trimEmail, isValidEmail, getEmailValidationError } = emailUtils.emailUtils;

    describe('trimEmail', () => {
      it('trims whitespaces from the email string', () => {
        expect(trimEmail('   abc@domain.com   ')).toBe('abc@domain.com');
      });
    });

    describe('isValidEmail', () => {
      [
        { input: validEmail, expected: true, desc: 'valid email' },
        { input: validEmailWithSpaces, expected: true, desc: 'valid email with spaces' },
        { input: invalidEmailFormat, expected: false, desc: 'invalid email format' },
        { input: tooLongEmail, expected: false, desc: 'email exceeding max length' },
        { input: '', expected: false, desc: 'empty string' },
        { input: 123 as any, expected: false, desc: 'non-string value' },
      ].forEach(({ input, expected, desc }) =>
        it(`returns ${expected} for ${desc}`, () => {
          expect(isValidEmail(input)).toBe(expected);
        }),
      );
    });

    describe('getEmailValidationError', () => {
      it('returns REQUIRED for empty, null or non-string values', () => {
        const expected = ValidationErrorMessages.EMAIL.REQUIRED;
        [undefined, null, 123 as any, '', '   '].forEach(val => {
          expect(getEmailValidationError(val)).toBe(expected);
        });
      });

      it('returns TOO_LONG when email length exceeds max limit', () => {
        expect(getEmailValidationError(tooLongEmail)).toBe(
          ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength),
        );
      });

      it('returns INVALID_TYPE when email format is invalid', () => {
        expect(getEmailValidationError(invalidEmailFormat)).toBe(
          ValidationErrorMessages.EMAIL.INVALID_TYPE,
        );
      });

      it('returns null for valid emails', () => {
        [validEmail, validEmailWithSpaces].forEach(val => {
          expect(getEmailValidationError(val)).toBeNull();
        });
      });
    });
  });

  describe('EmailValidator defaultMessage Method', () => {
    it('returns correct message based on input value', () => {
      const cases = [
        { value: '', expected: ValidationErrorMessages.EMAIL.REQUIRED },
        { value: '   ', expected: ValidationErrorMessages.EMAIL.REQUIRED },
        { value: null, expected: ValidationErrorMessages.EMAIL.REQUIRED },
        { value: undefined, expected: ValidationErrorMessages.EMAIL.REQUIRED },
        { value: 123, expected: ValidationErrorMessages.EMAIL.REQUIRED },
        { value: tooLongEmail, expected: ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength) },
        { value: invalidEmailFormat, expected: ValidationErrorMessages.EMAIL.INVALID_TYPE },
      ];

      cases.forEach(({ value, expected }) => {
        expect(emailUtils.emailValidator.defaultMessage({ value } as any)).toBe(expected);
      });
    });

    it('returns fallback INVALID_TYPE message when getEmailValidationError returns null', () => {
      jest.spyOn(emailUtils.emailUtils, 'getEmailValidationError').mockReturnValueOnce(null);
      const fakeArgs = { value: 'test@example.com' };
      const message = emailUtils.emailValidator.defaultMessage(fakeArgs as any);
      expect(message).toBe(ValidationErrorMessages.EMAIL.INVALID_TYPE);
    });
  });

  describe('IsEmail Decorator Integration Tests', () => {
    class TestDto {
      @IsEmail()
      email!: string;
    }

    const errorCases = [
      {
        values: ['', '   ', null as any, undefined as any, 123 as any],
        expectedMsg: ValidationErrorMessages.EMAIL.REQUIRED,
        description: 'empty or invalid type values',
      },
      {
        values: [tooLongEmail],
        expectedMsg: ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength),
        description: 'email exceeding max length',
      },
      {
        values: [invalidEmailFormat],
        expectedMsg: ValidationErrorMessages.EMAIL.INVALID_TYPE,
        description: 'invalid email format',
      },
    ];

    errorCases.forEach(({ values, expectedMsg, description }) => {
      it(`returns ${expectedMsg} message for ${description}`, async () => {
        const dto = new TestDto();
        for (const val of values) {
          dto.email = val;
          const [error] = await validate(dto);
          expect(error.constraints?.isEmail).toBe(expectedMsg);
        }
      });
    });

    const validCases = [validEmail, validEmailWithSpaces];
    validCases.forEach(val =>
      it(`validates correct email '${val.trim()}' without errors`, async () => {
        const dto = new TestDto();
        dto.email = val;
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }),
    );
  });
});
