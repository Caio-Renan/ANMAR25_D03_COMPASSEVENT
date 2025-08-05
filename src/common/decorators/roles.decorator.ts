import { Roles } from '@enums/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const RolesDecorator = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
