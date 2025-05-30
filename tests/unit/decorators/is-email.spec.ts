import { Email } from '../../../src/common/value-objects/email.vo';
import { validate } from 'class-validator';
import { IsEmail } from '../../../src/common/decorators/is-email.decorator';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsEmail()
  email!: string;
}

describe('IsEmail Decorator', () => {
  it('should invalidate empty or whitespace emails', async () => {
    const dto = new TestDto();

    dto.email = '';
    let errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('isEmail', ValidationErrorMessages.EMAIL.REQUIRED);

    dto.email = '   ';
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('isEmail', ValidationErrorMessages.EMAIL.REQUIRED);

    dto.email = null as any;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('isEmail', ValidationErrorMessages.EMAIL.REQUIRED);

    dto.email = undefined as any;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty('isEmail', ValidationErrorMessages.EMAIL.REQUIRED);
  });

  it(`should invalidate emails longer than ${Email.maxLength} characters`, async () => {
    const dto = new TestDto();
    const longEmail = 'a'.repeat(Email.maxLength - 8) + '@test.com';

    expect(longEmail.length).toBeGreaterThan(Email.maxLength);

    dto.email = longEmail;
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isEmail',
      ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength),
    );
  });

  it('should invalidate invalid email formats', async () => {
    const dto = new TestDto();
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@com',
      'username@domain..com',
      'username@domain,com',
      'username@domain com',
      'user name@domain.com',
      'username@@domain.com',
      'username@.domain.com',
    ];

    for (const email of invalidEmails) {
      dto.email = email;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isEmail',
        ValidationErrorMessages.EMAIL.INVALID_TYPE,
      );
    }
  });

  it('should validate correct emails and accept mixed case', async () => {
    const dto = new TestDto();
    const validEmails = [
      'user@example.com',
      'USER@EXAMPLE.COM',
      'User.Name+tag+sorting@example.com',
      'user_name@example.co.uk',
      'user-name@sub.domain.com',
    ];

    for (const email of validEmails) {
      dto.email = email;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
