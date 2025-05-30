import { validate } from 'class-validator';
import { IsBase64Image } from '../../../src/common/decorators/is-base64-image.decorator';
import { ValidationErrorMessages } from '../../../src/common/constants/error-messages/validation-error-messages';

class TestDto {
  @IsBase64Image()
  base64Image!: string;
}

describe('IsBase64Image Decorator', () => {
  it('should invalidate empty or non-string values', async () => {
    const dto = new TestDto();

    dto.base64Image = '';
    let errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.REQUIRED,
    );

    dto.base64Image = '   ';
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.REQUIRED,
    );

    dto.base64Image = null as any;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.REQUIRED,
    );

    dto.base64Image = undefined as any;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.REQUIRED,
    );

    dto.base64Image = 123 as any;
    errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.REQUIRED,
    );
  });

  it('should invalidate base64 with invalid length', async () => {
    const dto = new TestDto();
    dto.base64Image = 'abcd123';
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4,
    );
  });

  it('should invalidate base64 with invalid chars', async () => {
    const dto = new TestDto();
    dto.base64Image = 'abcd*1234===';
    const errors = await validate(dto);
    expect(errors[0].constraints).toHaveProperty(
      'isBase64Image',
      ValidationErrorMessages.BASE64_IMAGE.INVALID,
    );
  });

  it('should validate correct base64 strings', async () => {
    const dto = new TestDto();
    dto.base64Image = 'YWJjZA==';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate data URI style base64', async () => {
    const dto = new TestDto();
    dto.base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
