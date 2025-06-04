import { Module } from '@nestjs/common';
import { AwsModule } from 'src/config/aws/aws.module';

import { DynamoService } from '../../common/aws/dynamo.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
@Module({
  imports: [AwsModule],
  controllers: [UserController],
  providers: [UserService, DynamoService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
