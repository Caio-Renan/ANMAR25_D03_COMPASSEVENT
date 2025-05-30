import { validate } from 'class-validator';
import { IsValidInt } from '../../../src/common/decorators/is-valid-int.decorator';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsValidInt()
  value!: unknown;
}

describe('IsValidInt Decorator', () => {
  it('should invalidate empty string', async () => {
    const dto = new TestDto();
    dto.value = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isValidInt',
      ValidationErrorMessages.VALID_INT.NOT_A_NUMBER(''),
    );
  });

  it('should invalidate non-numeric strings', async () => {
    const dto = new TestDto();
    dto.value = 'abc';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isValidInt',
      ValidationErrorMessages.VALID_INT.NOT_A_NUMBER('abc'),
    );
  });

  it('should invalidate non-integer numbers', async () => {
    const dto = new TestDto();
    dto.value = 1.5;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isValidInt',
      ValidationErrorMessages.VALID_INT.NOT_A_INTEGER(1.5),
    );
  });

  it('should invalidate integers less than 1', async () => {
    const dto = new TestDto();
    dto.value = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isValidInt',
      ValidationErrorMessages.VALID_INT.TOO_SMALL(0),
    );
  });

  it(`should invalidate integers greater than Number.${Number.MAX_SAFE_INTEGER}`, async () => {
    const dto = new TestDto();
    const tooBig = Number.MAX_SAFE_INTEGER + 1;
    dto.value = tooBig;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(
      'isValidInt',
      ValidationErrorMessages.VALID_INT.TOO_LARGE(tooBig),
    );
  });

  it('should validate valid integer numbers', async () => {
    const dto = new TestDto();
    dto.value = 42;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate numeric string integers', async () => {
    const dto = new TestDto();
    dto.value = '123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
