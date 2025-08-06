import { ValidationErrorMessages } from '@constants/error-messages/validation-error-messages';
import { IsPhoneNumber } from '@decorators/is-phone-number.decorator';
import * as phoneUtil from '@decorators/utils/phone-number.util';
import { validate } from 'class-validator';

class TestDto {
  @IsPhoneNumber()
  phone!: unknown;
}

describe('IsPhoneNumber Decorator', () => {
  const dto = new TestDto();

  it.each(['+5511999998888', '+14155552671', '+442071838750', '+81312345678', '+61234567890'])(
    'should validate valid international phone number: %p',
    async phone => {
      dto.phone = phone;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    },
  );

  it.each([null, undefined, '', 123, {}, true])(
    'should invalidate empty, null or non-string value: %p',
    async value => {
      dto.phone = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isPhoneNumber',
        ValidationErrorMessages.PHONE_NUMBER.REQUIRED,
      );
    },
  );

  it('should invalidate phone numbers not starting with "+"', async () => {
    dto.phone = '5511999998888';
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isPhoneNumber',
      ValidationErrorMessages.PHONE_NUMBER.MUST_START_WITH_PLUS,
    );
  });

  it.each([
    '+123',
    '++5511999998888',
    '+5511abc99998888',
    '+999999999999999999999',
    '+phone12345',
    '+999999999',
  ])('should invalidate invalid phone number format: %p', async phone => {
    dto.phone = phone;
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isPhoneNumber',
      ValidationErrorMessages.PHONE_NUMBER.INVALID_TYPE,
    );
  });

  it('should return fallback message when getPhoneNumberValidationError returns null', () => {
    const spy = jest
      .spyOn(phoneUtil.phoneNumberUtils, 'getPhoneNumberValidationError')
      .mockReturnValue(null);

    const fakeArgs = { value: '+anyvalue' } as any;
    const message = phoneUtil.phoneNumberValidator.defaultMessage(fakeArgs);

    expect(message).toBe(ValidationErrorMessages.PHONE_NUMBER.INVALID_TYPE);

    spy.mockRestore();
  });

  describe('Phone Number Utility Functions', () => {
    describe('isValidPhoneNumber', () => {
      it.each(['+5511999998888', '+14155552671', '+442071838750', '+81312345678', '+61234567890'])(
        'should return true for valid phone number: %p',
        phone => {
          expect(phoneUtil.phoneNumberUtils.isValidPhoneNumber(phone)).toBe(true);
        },
      );

      it.each([null, undefined, '', 123, {}, true])(
        'should return false for empty, null, or non-string value: %p',
        value => {
          expect(phoneUtil.phoneNumberUtils.isValidPhoneNumber(value)).toBe(false);
        },
      );

      it.each(['5511999998888', '1234567890', '00441234567890'])(
        'should return false for phone numbers not starting with "+": %p',
        phone => {
          expect(phoneUtil.phoneNumberUtils.isValidPhoneNumber(phone)).toBe(false);
        },
      );

      it.each([
        '+123',
        '++5511999998888',
        '+5511abc99998888',
        '+999999999999999999999',
        '+phone12345',
        '+999999999',
      ])('should return false for invalid phone number format: %p', phone => {
        expect(phoneUtil.phoneNumberUtils.isValidPhoneNumber(phone)).toBe(false);
      });
    });
  });
});
