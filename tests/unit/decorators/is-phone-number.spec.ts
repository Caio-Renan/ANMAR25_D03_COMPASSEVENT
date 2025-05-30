import { validate } from 'class-validator';
import { IsPhoneNumber } from '../../../src/common/decorators/is-phone-number.decorator';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsPhoneNumber()
  phone!: unknown;
}

describe('IsPhoneNumber Decorator', () => {
  it('should validate valid international phone numbers', async () => {
    const dto = new TestDto();
    const validPhones = [
      '+5511999998888',
      '+14155552671',
      '+442071838750',
      '+81312345678',
      '+61234567890',
    ];

    for (const phone of validPhones) {
      dto.phone = phone;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should invalidate empty or non-string values', async () => {
    const dto = new TestDto();
    const invalidValues = [null, undefined, '', 123, {}, true];

    for (const value of invalidValues) {
      dto.phone = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isPhoneNumber',
        ValidationErrorMessages.PHONE_NUMBER.REQUIRED,
      );
    }
  });

  it('should invalidate phone numbers not starting with +', async () => {
    const dto = new TestDto();
    dto.phone = '5511999998888';
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isPhoneNumber',
      ValidationErrorMessages.PHONE_NUMBER.MUST_START_WITH_PLUS,
    );
  });

  it('should invalidate invalid phone numbers', async () => {
    const dto = new TestDto();
    const invalidPhones = [
      '+123',
      '++5511999998888',
      '+5511abc99998888',
      '+999999999999999999999',
      '+phone12345',
      '+999999999',
    ];

    for (const phone of invalidPhones) {
      dto.phone = phone;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isPhoneNumber',
        ValidationErrorMessages.PHONE_NUMBER.INVALID_TYPE,
      );
    }
  });
});
