import { validate } from 'class-validator';
import { IsName } from '../../../src/common/decorators/is-name.decorator';
import { Name } from '../../../src/common/value-objects/name.vo';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsName()
  name!: unknown;
}

describe('IsName Decorator', () => {
  it('should invalidate non-string values', async () => {
    const dto = new TestDto();
    const invalidValues = [null, undefined, 123, true, {}];

    for (const value of invalidValues) {
      dto.name = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isName',
        ValidationErrorMessages.NAME.INVALID_TYPE,
      );
    }
  });

  it('should invalidate empty or whitespace-only strings', async () => {
    const dto = new TestDto();
    const invalidValues = ['', '    '];

    for (const value of invalidValues) {
      dto.name = value;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty('isName', ValidationErrorMessages.NAME.REQUIRED);
    }
  });

  it(`should invalidate names longer than ${Name.maxLength} characters`, async () => {
    const dto = new TestDto();
    const longName = 'a'.repeat(Name.maxLength) + 1;

    dto.name = longName;
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isName',
      ValidationErrorMessages.NAME.TOO_LONG(Name.maxLength),
    );
  });

  it('should invalidate names with invalid characters', async () => {
    const dto = new TestDto();
    const invalidNames = ['John123', 'John@Doe', 'Jane_Doe', 'Name!'];

    for (const name of invalidNames) {
      dto.name = name;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isName',
        ValidationErrorMessages.NAME.INVALID_CHARACTERS,
      );
    }
  });

  it('should validate valid names and normalize spaces', async () => {
    const dto = new TestDto();
    const validName = '  João   da Silva   ';
    dto.name = validName;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate names with apostrophes, dots and hyphens', async () => {
    const dto = new TestDto();
    const validNames = ["O'Connor", 'Anne-Marie', 'Dr. John Smith', "D'Arcy", 'Jean-Luc Picard'];

    for (const name of validNames) {
      dto.name = name;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
