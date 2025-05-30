import { validate } from 'class-validator';
import { IsPassword } from '../../../src/common/decorators/is-password.decorator';
import { Password } from '../../../src/common/value-objects/password.vo';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsPassword()
  password!: unknown;
}

describe('IsPassword Decorator', () => {
  it('should invalidate non-string values', async () => {
    const dto = new TestDto();
    const invalidValues = [null, undefined, 12345678, true, {}];

    for (const value of invalidValues) {
      dto.password = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isPassword',
        ValidationErrorMessages.PASSWORD.INVALID_TYPE,
      );
    }
  });

  it('should invalidate empty or whitespace-only passwords', async () => {
    const dto = new TestDto();
    const invalidValues = ['', '    '];

    for (const value of invalidValues) {
      dto.password = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isPassword',
        ValidationErrorMessages.PASSWORD.REQUIRED,
      );
    }
  });

  it(`should invalidate passwords shorter than ${Password.minLength} or longer than ${Password.maxLength} chars`, async () => {
    const dto = new TestDto();

    dto.password = 'abc123';
    let errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isPassword',
      ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );

    dto.password = 'a'.repeat(Password.maxLength) + '1';

    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isPassword',
      ValidationErrorMessages.PASSWORD.LENGTH(Password.minLength, Password.maxLength),
    );
  });

  it('should invalidate passwords containing spaces inside', async () => {
    const dto = new TestDto();
    dto.password = 'abc 1234';
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isPassword',
      ValidationErrorMessages.PASSWORD.NO_SPACES_ALLOWED,
    );
  });

  it('should invalidate passwords without both letters and numbers', async () => {
    const dto = new TestDto();
    const invalidPasswords = ['abcdefgh', '12345678', '!!!@@@###'];

    for (const password of invalidPasswords) {
      dto.password = password;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isPassword',
        ValidationErrorMessages.PASSWORD.MUST_CONTAIN_LETTERS_AND_NUMBERS,
      );
    }
  });

  it('should validate valid passwords', async () => {
    const dto = new TestDto();
    const validPasswords = ['abc12345', 'A1b2C3d4', 'pass123word'];

    for (const password of validPasswords) {
      dto.password = password;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should trim whitespace from password', async () => {
    const dto = new TestDto();

    const passwordWithSpaces = '   abc12345   ';
    dto.password = passwordWithSpaces;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
