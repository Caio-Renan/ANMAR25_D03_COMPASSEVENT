import { emailValidator } from '@utils/email.util';
import { registerDecorator, ValidationOptions } from 'class-validator';

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
