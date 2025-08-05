import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from '@subscription/dtos/create-subscription.dto';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
