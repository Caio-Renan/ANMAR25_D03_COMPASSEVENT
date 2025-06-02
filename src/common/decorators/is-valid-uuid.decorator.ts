import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

import { uuidValidator } from './utils/valid-uuid.util';

export function IsValidUuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidUuid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: uuidValidator,
    });
  };
}
