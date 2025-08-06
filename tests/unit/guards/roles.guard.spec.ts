import { Roles } from '@enums/roles.enum';
import { AccessDeniedException, UserNotFoundException } from '@exceptions/index';
import { RolesGuard } from '@guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;
  let context: ExecutionContext;

  const mockExecutionContext = (user: any = {}) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow access if no roles are required', () => {
    const getAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    context = mockExecutionContext({ role: Roles.ADMIN });

    expect(guard.canActivate(context)).toBe(true);
    expect(getAllAndOverride).toHaveBeenCalled();
  });

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN]);

    context = mockExecutionContext({ role: Roles.ADMIN });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UserNotFoundException if user has no role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN]);

    context = mockExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(UserNotFoundException);
  });

  it('should throw AccessDeniedException if user role is not allowed', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN]);

    context = mockExecutionContext({ role: Roles.PARTICIPANT });

    expect(() => guard.canActivate(context)).toThrow(AccessDeniedException);
  });
});
