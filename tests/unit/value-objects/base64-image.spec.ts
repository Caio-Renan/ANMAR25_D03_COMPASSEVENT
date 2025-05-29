import { BadRequestException } from '@nestjs/common';
import { Base64Image } from '../../../src/common/value-objects/base64-image.vo';
import { ValueObjectErrorMessages } from '../../../src/common/constants/error-messages/value-object-error-messages';

describe('Base64Image', () => {
  const validBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
  const validBase64WithPadding = 'YWJjZA==';

  it('should throw if value is not a string or empty', () => {
    expect(() => new Base64Image('')).toThrow(BadRequestException);
    expect(() => new Base64Image('')).toThrow(ValueObjectErrorMessages.BASE64_IMAGE.REQUIRED);

    expect(() => new Base64Image('    ')).toThrow(BadRequestException);
    expect(() => new Base64Image('    ')).toThrow(ValueObjectErrorMessages.BASE64_IMAGE.REQUIRED);

    expect(() => new Base64Image(null as any)).toThrow(BadRequestException);
    expect(() => new Base64Image(null as any)).toThrow(
      ValueObjectErrorMessages.BASE64_IMAGE.REQUIRED,
    );

    expect(() => new Base64Image(undefined as any)).toThrow(BadRequestException);
    expect(() => new Base64Image(undefined as any)).toThrow(
      ValueObjectErrorMessages.BASE64_IMAGE.REQUIRED,
    );

    expect(() => new Base64Image(123 as any)).toThrow(BadRequestException);
    expect(() => new Base64Image(123 as any)).toThrow(
      ValueObjectErrorMessages.BASE64_IMAGE.REQUIRED,
    );
  });

  it('should extract base64 part from data URI prefix', () => {
    const dataUri = `data:image/png;base64,${validBase64}`;
    const instance = new Base64Image(dataUri);
    expect(instance.toString()).toBe(validBase64);
  });

  it('should throw if base64 length is not multiple of 4', () => {
    const invalidLength = 'abcd123';
    expect(() => new Base64Image(invalidLength)).toThrow(BadRequestException);
    expect(() => new Base64Image(invalidLength)).toThrow(
      ValueObjectErrorMessages.BASE64_IMAGE.LENGTH_MULTIPLE_OF_4,
    );
  });

  it('should throw if base64 has invalid characters', () => {
    const invalidBase64 = 'abcd*1234===';
    expect(() => new Base64Image(invalidBase64)).toThrow(BadRequestException);
    expect(() => new Base64Image(invalidBase64)).toThrow(
      ValueObjectErrorMessages.BASE64_IMAGE.INVALID,
    );
  });

  it('should create instance with valid base64 string', () => {
    const instance = new Base64Image(validBase64);
    expect(instance.toString()).toBe(validBase64);
  });

  it('should create instance with valid base64 string with padding', () => {
    const instance = new Base64Image(validBase64WithPadding);
    expect(instance.toString()).toBe(validBase64WithPadding);
  });

  it('toBuffer() should return a Buffer from base64 string', () => {
    const instance = new Base64Image(validBase64WithPadding);
    const buffer = instance.toBuffer();
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.toString('base64')).toBe(validBase64WithPadding);
  });

  it('base64 getter should return the base64 string', () => {
    const instance = new Base64Image(validBase64);
    expect(instance.base64).toBe(validBase64);
  });
});
