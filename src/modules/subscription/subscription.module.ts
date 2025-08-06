import { DynamoService } from '@aws/dynamo.service';
import { AwsModule } from '@config/aws/aws.module';
import { EventModule } from '@event/event.module';
import { EventRepository } from '@event/repositories/event.repository';
import { Module } from '@nestjs/common';
import { SubscriptionController } from '@subscription/controllers/subscription.controller';
import { SubscriptionRepository } from '@subscription/repositories/subscription.repository';
import { SubscriptionService } from '@subscription/services/subscription.service';
import { UserRepository } from '@user/repositories/user.repository';
import { UserModule } from '@user/user.module';
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
