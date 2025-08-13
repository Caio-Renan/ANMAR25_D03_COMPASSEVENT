import { Roles } from '@enums/roles.enum';
import { Status } from '@enums/status.enum';

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
  profileImageUrl?: string;
}
