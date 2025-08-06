import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { IsPassword } from '@decorators/is-password.decorator';
import * as passwordUtilss from '@decorators/utils/password.util';
import { Password } from '@vo/password.vo';
import { validate } from 'class-validator';

class TestDto {
  @IsPassword()
  password!: unknown;
}

describe('IsPassword Decorator - Validation Integration', () => {
  const dto = new TestDto();

  it.each([[null, undefined, 12345678, true, {}, [], () => {}]])(
    'should invalidate non-string values: %p',
    async (...invalidValues) => {
      for (const value of invalidValues) {
        dto.password = value;
        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].constraints).toHaveProperty(
          'isPassword',
          ValidationErrorMessages.PASSWORD.INVALID_TYPE,
        );
      }
    },
  );

  it.each([['']])('should invalidate empty strings: %p', async (...invalidValues) => {
    for (const value of invalidValues) {
      dto.password = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isPassword',
        ValidationErrorMessages.PASSWORD.REQUIRED,
      );
    }
  });

  it(`should invalidate passwords shorter than ${Password.minLength} or longer than ${Password.maxLength}`, async () => {
    dto.password = 'a1b2c3';
    let errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isPassword',
      ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );

    dto.password = 'a1'.repeat(Password.maxLength) + 'X';
    errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isPassword',
      ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );
  });

  it.each([' abc12345', 'abc12345 ', 'abc 12345', 'abc\t1234'])(
    'should invalidate passwords containing spaces anywhere: %p',
    async password => {
      dto.password = password;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isPassword',
        ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED,
      );
    },
  );

  it.each(['abcdefgh', 'ABCDEFGH', '12345678', '!!!@@@###'])(
    'should invalidate passwords lacking both letters and numbers: %p',
    async password => {
      dto.password = password;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(
        'isPassword',
        ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS,
      );
    },
  );

  it.each([
    'abc12345',
    'A1b2C3d4',
    'Pass123word',
    'p4ssw0rdTest',
    'StrongPassword1',
    'XyZ987654321',
  ])('should validate valid passwords: %p', async password => {
    dto.password = password;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should return fallback message when getPasswordValidationError returns null', () => {
    jest
      .spyOn(passwordUtilss.passwordUtils, 'getPasswordValidationError')
      .mockReturnValueOnce(null);

    const fakeArgs = { value: 'any-value' };
    const message = passwordUtilss.passwordValidator.defaultMessage(fakeArgs as any);

    expect(message).toBe(ValidationErrorMessages.PASSWORD.INVALID_TYPE);
  });
});

describe('passwordUtils - Utility Functions', () => {
  describe('isValidPassword()', () => {
    it.each([
      null,
      undefined,
      12345678,
      {},
      [],
      () => {},
      '',
      'a1b2c3',
      'a1'.repeat(33),
      'abc 12345',
      ' abc12345',
      'abc12345 ',
      'abc\t1234',
      'abcdefgh',
      'ABCDEFGH',
      '12345678',
      '!!!@@@###',
    ])('should return false for invalid password: %p', password => {
      expect(passwordUtilss.passwordUtils.isValidPassword(password)).toBe(false);
    });

    it.each([
      'abc12345',
      'A1b2C3d4',
      'Pass123word',
      'p4ssw0rdTest',
      'StrongPassword1',
      'XyZ987654321',
    ])('should return true for valid password: %p', password => {
      expect(passwordUtilss.passwordUtils.isValidPassword(password)).toBe(true);
    });
  });

  describe('getPasswordValidationError()', () => {
    it.each([
      [null, ValidationErrorMessages.PASSWORD.INVALID_TYPE],
      [123, ValidationErrorMessages.PASSWORD.INVALID_TYPE],
      [{}, ValidationErrorMessages.PASSWORD.INVALID_TYPE],
      ['', ValidationErrorMessages.PASSWORD.REQUIRED],
      ['a1b2c3', ValidationErrorMessages.PASSWORD.LENGTH(8, 64)],
      ['a1'.repeat(33), ValidationErrorMessages.PASSWORD.LENGTH(8, 64)],
      ['abc 12345', ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED],
      [' abc12345', ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED],
      ['abc12345 ', ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED],
      ['abc\t1234', ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED],
      ['abcdefgh', ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS],
      ['12345678', ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS],
      ['!!!@@@###', ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS],
    ])('should return appropriate error for %p', (password, expectedMessage) => {
      expect(passwordUtilss.passwordUtils.getPasswordValidationError(password)).toBe(
        expectedMessage,
      );
    });

    it.each(['abc12345', 'A1b2C3d4', 'Pass123word'])(
      'should return null for valid password: %p',
      password => {
        expect(passwordUtilss.passwordUtils.getPasswordValidationError(password)).toBeNull();
      },
    );
  });
});
