import { validate } from 'class-validator';
import { Name } from 'common/value-objects/name.vo';

import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';
import { IsName } from '../../../src/common/decorators/is-name.decorator';
import * as NameUtils from '../../../src/common/decorators/utils/name.util';

class TestDto {
  @IsName()
  name!: unknown;
}

describe('IsName Decorator - Integration Validation', () => {
  const dto = new TestDto();

  it.each([[null, undefined, 123, true, {}, []]])(
    'should invalidate non-string values: %p',
    async (...invalidValues) => {
      for (const value of invalidValues) {
        dto.name = value;
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty(
          'isName',
          ValidationErrorMessages.NAME.INVALID_TYPE,
        );
      }
    },
  );

  it.each([['', '   ']])(
    'should invalidate empty or whitespace-only strings: %p',
    async (...invalidValues) => {
      for (const value of invalidValues) {
        dto.name = value;
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty(
          'isName',
          ValidationErrorMessages.NAME.REQUIRED,
        );
      }
    },
  );

  it(`should invalidate names longer than max length (${Name.maxLength})`, async () => {
    const longName = 'a'.repeat(Name.maxLength) + 'a';
    dto.name = longName;
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isName',
      ValidationErrorMessages.NAME.TOO_LONG(Name.maxLength),
    );
  });

  it.each(['John123', 'John@Doe', 'Jane_Doe', 'Name!', '123', '@#$%'])(
    'should invalidate names with invalid characters: %p',
    async name => {
      dto.name = name;
      const errors = await validate(dto);
      expect(errors[0].constraints).toHaveProperty(
        'isName',
        ValidationErrorMessages.NAME.INVALID_CHARACTERS,
      );
    },
  );

  it('should validate valid names and normalize spaces', async () => {
    dto.name = '  João   da  Silva   ';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it.each(["O'Connor", 'Anne-Marie', 'Dr. John Smith', "D'Arcy", 'Jean-Luc Picard'])(
    'should validate names with apostrophes, dots and hyphens: %p',
    async name => {
      dto.name = name;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    },
  );

  it('should return fallback message when getNameValidationError returns null', () => {
    jest.spyOn(NameUtils.nameUtils, 'getNameValidationError').mockReturnValueOnce(null);

    const fakeArgs = { value: 'any-name' };
    const message = NameUtils.nameValidator.defaultMessage(fakeArgs as any);

    expect(message).toBe(ValidationErrorMessages.NAME.INVALID_TYPE);
  });
});

describe('nameUtils.getNameValidationError - Utils Functions', () => {
  it.each(['João da Silva', "O'Connor", 'Anne-Marie'])(
    'should return null for valid names: %p',
    name => {
      expect(NameUtils.nameUtils.getNameValidationError(name)).toBeNull();
    },
  );
});
