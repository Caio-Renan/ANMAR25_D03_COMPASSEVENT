import { nameValidator } from '@utils/name.util';
import { registerDecorator, type ValidationOptions } from 'class-validator';

export function IsName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: nameValidator,
    });
  };
}
