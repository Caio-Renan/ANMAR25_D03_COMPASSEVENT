import { Status } from 'src/common/enums/status.enum';

export interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  organizerId: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}
