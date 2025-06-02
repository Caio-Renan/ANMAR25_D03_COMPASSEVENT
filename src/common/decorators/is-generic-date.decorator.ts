import { registerDecorator, ValidationOptions } from 'class-validator';

import { genericDateValidator } from './utils/generic-date.util';

export function IsGenericDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGenericDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: genericDateValidator,
    });
  };
}
