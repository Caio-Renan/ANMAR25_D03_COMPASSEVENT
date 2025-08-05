import { ROLES_KEY, RolesDecorator } from '@decorators/roles.decorator';
import { Roles } from '@enums/roles.enum';
import { Reflector } from '@nestjs/core';

describe('RolesDecorator', () => {
  it('should set metadata with the correct roles', () => {
    const testRoles = [Roles.ADMIN, Roles.ORGANIZER, Roles.PARTICIPANT];

    class TestClass {}
    Reflect.decorate([RolesDecorator(...testRoles)], TestClass);

    const reflector = new Reflector();
    const roles = reflector.get<string[]>(ROLES_KEY, TestClass);

    expect(roles).toEqual(testRoles);
  });
});
