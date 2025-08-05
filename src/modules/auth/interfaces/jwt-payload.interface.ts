import { Roles } from '@enums/roles.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Roles;
}
