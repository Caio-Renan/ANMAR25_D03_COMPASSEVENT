import { Status } from '@enums/status.enum';

export interface SubscriptionItem {
  id: string;
  userId: string;
  eventId: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}
