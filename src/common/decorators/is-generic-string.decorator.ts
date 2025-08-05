import { genericStringValidator } from '@utils/generic-string.util';
import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsGenericString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGenericString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: genericStringValidator,
    });
  };
}
