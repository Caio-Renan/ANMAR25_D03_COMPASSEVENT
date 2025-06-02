import { registerDecorator, ValidationOptions } from 'class-validator';

import { emailValidator } from './utils/email.util';

export function IsEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: emailValidator,
    });
  };
}
