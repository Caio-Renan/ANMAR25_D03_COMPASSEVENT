import { Module } from '@nestjs/common';
import { AwsModule } from 'src/config/aws/aws.module';

import { DynamoService } from '../../common/aws/dynamo.service';
import { UserRepository } from '../user/repositories/user.repository';
import { UserModule } from '../user/user.module';
import { EventController } from './controllers/event.controller';
import { EventRepository } from './repositories/event.repository';
import { EventService } from './services/event.service';
@Module({
  imports: [AwsModule, UserModule],
  controllers: [EventController],
  providers: [EventService, DynamoService, EventRepository, UserRepository],
  exports: [EventService],
})
export class EventModule {}
