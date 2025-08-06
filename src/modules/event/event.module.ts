import { DynamoService } from '@aws/dynamo.service';
import { AwsModule } from '@config/aws/aws.module';
import { EventController } from '@event/controllers/event.controller';
import { EventRepository } from '@event/repositories/event.repository';
import { EventService } from '@event/services/event.service';
import { Module } from '@nestjs/common';
import { UserRepository } from '@user/repositories/user.repository';
import { UserModule } from '@user/user.module';
@Module({
  imports: [AwsModule, UserModule],
  controllers: [EventController],
  providers: [EventService, DynamoService, EventRepository, UserRepository],
  exports: [EventService],
})
export class EventModule {}
