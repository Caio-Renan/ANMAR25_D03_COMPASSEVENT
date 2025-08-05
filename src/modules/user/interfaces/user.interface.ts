import { Roles } from 'common/enums/roles.enum';
import { Status } from 'common/enums/status.enum';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Roles;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}
