import { Module } from '@nestjs/common';
import { AwsModule } from 'config/aws/aws.module';

import { DynamoService } from '../../common/aws/dynamo.service';
import { EventModule } from '../event/event.module';
import { EventRepository } from '../event/repositories/event.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { UserModule } from '../user/user.module';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriptionService } from './services/subscription.service';
@Module({
  imports: [AwsModule, UserModule, EventModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    DynamoService,
    EventRepository,
    UserRepository,
    SubscriptionRepository,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
