import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Roles } from '../enums/roles.enum';
import { AccessDeniedException } from '../exceptions/custom/access-denied.exception';
import { UserNotFoundException } from '../exceptions/custom/user-not-found.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role) {
      throw new UserNotFoundException();
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    throw new AccessDeniedException();
  }
}
