import { genericDateValidator } from '@utils/generic-date.util';
import { registerDecorator, ValidationOptions } from 'class-validator';

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
