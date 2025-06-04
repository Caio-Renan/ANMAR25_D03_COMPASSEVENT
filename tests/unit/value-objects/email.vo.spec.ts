import { BadRequestException } from '@nestjs/common';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { Email } from '../../../src/common/value-objects/email.vo';

describe('Email', () => {
  it('should throw if email is empty or only whitespace', () => {
    expect(() => new Email('')).toThrow(BadRequestException);
    expect(() => new Email('')).toThrow(ValidationErrorMessages.EMAIL.REQUIRED);

    expect(() => new Email('    ')).toThrow(BadRequestException);
    expect(() => new Email('    ')).toThrow(ValidationErrorMessages.EMAIL.REQUIRED);

    expect(() => new Email(null as any)).toThrow(BadRequestException);
    expect(() => new Email(null as any)).toThrow(ValidationErrorMessages.EMAIL.REQUIRED);

    expect(() => new Email(undefined as any)).toThrow(BadRequestException);
    expect(() => new Email(undefined as any)).toThrow(ValidationErrorMessages.EMAIL.REQUIRED);
  });

  it(`should throw if email is longer than ${Email.maxLength} characters`, () => {
    const longEmail = 'a'.repeat(Email.maxLength - 8) + '@test.com';
    expect(longEmail.length).toBeGreaterThan(Email.maxLength);
    expect(() => new Email(longEmail)).toThrow(BadRequestException);
    expect(() => new Email(longEmail)).toThrow(
      ValidationErrorMessages.EMAIL.TOO_LONG(Email.maxLength),
    );
  });

  it('should throw if email format is invalid', () => {
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

    invalidEmails.forEach(email => {
      expect(() => new Email(email)).toThrow(BadRequestException);
      expect(() => new Email(email)).toThrow(ValidationErrorMessages.EMAIL.INVALID_TYPE);
    });
  });

  it('should accept valid emails and normalize to lowercase', () => {
    const validEmails = [
      'user@example.com',
      'USER@EXAMPLE.COM',
      'User.Name+tag+sorting@example.com',
      'user_name@example.co.uk',
      'user-name@sub.domain.com',
    ];

    validEmails.forEach(email => {
      const instance = new Email(email);
      expect(instance.value).toBe(email.trim().toLowerCase());
      expect(instance.toString()).toBe(email.trim().toLowerCase());
    });
  });
});
