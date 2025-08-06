import { passwordValidator } from '@utils/password.util';
import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: passwordValidator,
    });
  };
}
