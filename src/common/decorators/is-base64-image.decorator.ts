import { registerDecorator, ValidationOptions } from 'class-validator';

import { base64ImageValidator } from './utils/base64-image.util';

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: base64ImageValidator,
    });
  };
}
