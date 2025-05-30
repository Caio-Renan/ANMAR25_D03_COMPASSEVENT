import { validate } from 'class-validator';
import { IsGenericDate } from '../../../src/common/decorators/is-generic-date.decorator';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsGenericDate()
  date!: unknown;
}

describe('IsGenericDate Decorator', () => {
  it('should invalidate non Date/string/number types', async () => {
    const dto = new TestDto();

    dto.date = true;
    let errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericDate',
      ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE,
    );

    dto.date = false;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericDate',
      ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE,
    );

    dto.date = null;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericDate',
      ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE,
    );

    dto.date = undefined;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericDate',
      ValidationErrorMessages.GENERIC_DATE.INVALID_TYPE,
    );
  });

  it('should invalidate invalid date values', async () => {
    const dto = new TestDto();

    dto.date = 'not-a-date';
    let errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericDate',
      ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE('not-a-date'),
    );

    dto.date = NaN;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isGenericDate',
      ValidationErrorMessages.GENERIC_DATE.INVALID_VALUE(NaN),
    );
  });

  it('should validate valid Date object', async () => {
    const dto = new TestDto();
    dto.date = new Date();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate valid date string', async () => {
    const dto = new TestDto();
    dto.date = '2023-01-01T00:00:00.000Z';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate valid timestamp number', async () => {
    const dto = new TestDto();
    dto.date = 1685260800000;
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
